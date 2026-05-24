import { useState, useEffect } from "react";
import { DataTable } from "../../components/DataTable";
import { assessmentResultApi, assessmentRoundsApi } from "../../api/resourceApi";
import { toast } from "react-toastify";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Typography,
  Autocomplete,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const AssessmentResultsManagement = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingResult, setEditingResult] = useState(null);

  // Khởi tạo
  const [formData, setFormData] = useState({
    id: null,
    assignmentId: "",
    roundId: "",
    results: [], // Luôn là mảng
  });

  const [suggestedCriteria, setSuggestedCriteria] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchResults();
    fetchCriteriaForRound(formData.roundId);
  }, [page, rowsPerPage, search]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const response = await assessmentResultApi.getAllResults(
        null,
        page,
        rowsPerPage,
        search,
      );
      console.log("Fetched assessment results:", response);
      setData(response?.content || []);
      setTotalCount(response?.totalElements || 0);
    } catch (err) {
      console.error("Error loading assessment results:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCriteriaForRound = async (roundId) => {
    if (!roundId) {
      setSuggestedCriteria([]);
      return;
    }
    try {
      const round = await assessmentRoundsApi.getRoundById(roundId);
      const criteria = round?.data?.roundCriteria || [];
      setSuggestedCriteria(criteria);

      const initializedResults = criteria.map(c => ({
        criterionId: c.criterionId,
        score: "",
        comments: ""
      }));

      if (!editingResult) {
        setFormData(prev => ({ ...prev, results: initializedResults }));
      }
    } catch (err) {
      console.error("Lỗi lấy tiêu chí:", err);
    }
  };

  const handleOpenDialog = async (result = null) => {
    if (result) {
      setEditingResult(result);
      await fetchCriteriaForRound(result.roundId);
      setFormData({
        id: result.id,
        assignmentId: result.assignmentId || "",
        roundId: result.roundId || "",
        // Map về đúng cấu trúc chuẩn, đảm bảo có id
        results: [{
          criterionId: result.criterionId,
          score: result.score,
          comments: result.comments
        }]
      });
    } else {
      setEditingResult(null);
      setFormData({
        id: null,
        assignmentId: "",
        roundId: "",
        results: [{ criterionId: "", score: "", comments: "" }]
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingResult(null);
    setFormData({
      id: null,
      assignmentId: "",
      roundId: "",
      results: [{ criterionId: "", score: "", comments: "" }],
    });
    setSuggestedCriteria([]);
  };

  const handleResultChange = (index, field, value) => {
    const newResults = [...formData.results];
    newResults[index][field] = value;
    setFormData({ ...formData, results: newResults });
  };

  const handleAddResultRow = () => {
    setFormData({
      ...formData,
      results: [...formData.results, { criterionId: "", score: "", comments: "" }]
    });
  };

  const handleRemoveResultRow = (index) => {
    const newResults = formData.results.filter((_, i) => i !== index);
    setFormData({ ...formData, results: newResults });
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      if (editingResult) {
        // UPDATE: Dùng ID ở cấp cao nhất (formData.id)
        const currentRow = formData.results[0];
        await assessmentResultApi.updateResult(formData.id, {
          score: parseFloat(currentRow.score) || 0,
          comments: currentRow.comments || ""
        });
        toast.success("Cập nhật thành công!");
      } else {
        // CREATE: Vẫn gửi mảng như cũ
        const payload = {
          assignmentId: parseInt(formData.assignmentId),
          roundId: parseInt(formData.roundId),
          results: formData.results.map(r => ({
            criterionId: parseInt(r.criterionId),
            score: parseFloat(r.score) || 0,
            comments: r.comments || ""
          }))
        };
        await assessmentResultApi.createResult(payload);
        toast.success("Tạo thành công!");
      }

      handleCloseDialog();
      fetchResults();
    } catch (err) {
      toast.error("Lỗi khi lưu!");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: "id", label: "ID" },
    { field: "assignmentName", label: "Tên Phân công" },
    { field: "roundName", label: "Vòng Đánh giá" },
    { field: "evaluatorName", label: "Người đánh giá" },
    { field: "evaluationDate", label: "Ngày đánh giá" },
  ];

  return (
    <Box>
      <DataTable
        title="Assessment Results Management"
        columns={columns}
        data={data}
        loading={loading}
        onEdit={(result) => handleOpenDialog(result)}
        onAdd={() => handleOpenDialog()}
        totalCount={totalCount}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(newPage) => setPage(newPage)}
        onRowsPerPageChange={(newRowsPerPage) => {
          setRowsPerPage(newRowsPerPage);
          setPage(0);
        }}
        searchValue={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(0);
        }}
        onDetail={(result) => navigate(`/admin/assessment-results/${result.id}`)}
      />

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 'bold' }}>
          {editingResult ? "Cập nhật kết quả đánh giá" : "Thêm kết quả đánh giá mới"}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Mã phân công (Assignment ID)"
                value={formData.assignmentId}
                onChange={(e) => setFormData({ ...formData, assignmentId: e.target.value })}
                disabled={editingResult !== null}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Mã vòng đánh giá (Round ID)"
                value={formData.roundId}
                onChange={(e) => {
                  const id = e.target.value;
                  setFormData({ ...formData, roundId: id });
                  fetchCriteriaForRound(id);
                }}
                margin="normal"
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, p: 2, bgcolor: '#f8f9fa', borderRadius: 2, border: '1px solid #e0e0e0' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontSize: '1.1rem' }}>Chi tiết điểm các tiêu chí</Typography>
              <Button variant="outlined" size="small" onClick={handleAddResultRow}>
                + Thêm tiêu chí
              </Button>
            </Box>

            {formData.results.map((item, index) => (
              <Box key={index} sx={{ mb: 2, p: 2, bgcolor: 'white', borderRadius: 1, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={3}>
                    <Autocomplete
                      sx={{ minWidth: 200 }}
                      fullWidth
                      options={suggestedCriteria}
                      getOptionLabel={(option) => option.criterionName || ""}
                      value={suggestedCriteria.find(c => c.criterionId == item.criterionId) || null}
                      isOptionEqualToValue={(option, value) => option.criterionId == value.criterionId}
                      onChange={(e, newValue) => {
                        handleResultChange(index, "criterionId", newValue ? newValue.criterionId : "");
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label="Chọn tiêu chí" size="small" />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      fullWidth
                      label="Điểm"
                      type="number"
                      size="small"
                      inputProps={{ step: "0.1", min: "0" }}
                      value={item.score}
                      onChange={(e) => handleResultChange(index, "score", e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={5}>
                    <TextField
                      fullWidth
                      label="Nhận xét"
                      size="small"
                      value={item.comments
                      }
                      onChange={(e) => handleResultChange(index, "comments", e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={2} sx={{ textAlign: 'right' }}>
                    <Button
                      color="error"
                      onClick={() => handleRemoveResultRow(index)}
                      disabled={formData.results.length === 1}
                    >
                      XÓA
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            ))}
          </Box>

        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog} color="inherit">Hủy</Button>
          <Button onClick={handleSave} variant="contained" disabled={loading}>
            {loading ? "Đang lưu..." : "Lưu Kết Quả"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AssessmentResultsManagement;