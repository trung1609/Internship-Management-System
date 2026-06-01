import { useState, useEffect, useContext } from "react";
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
  Typography,
  Autocomplete,
  Stack,
  Paper,
  Divider
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Delete as DeleteIcon } from "@mui/icons-material";
const AssessmentResultsManagement = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingResult, setEditingResult] = useState(null);

  const [formData, setFormData] = useState({
    id: null,
    assignmentId: "",
    roundId: "",
    results: [],
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
        const currentRow = formData.results[0];
        await assessmentResultApi.updateResult(formData.id, {
          score: parseFloat(currentRow.score) || 0,
          comments: currentRow.comments || ""
        });
        toast.success("Cập nhật thành công!");
      } else {
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

  const { user } = useContext(AuthContext);
  const isMentor = user?.role === "MENTOR" || user?.role === "ROLE_MENTOR";

  return (
    <Box sx={{ p: 3 }}>
      {/* Header trang */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#1a237e", mb: 0.5 }}>
            Quản lý Kết quả Đánh giá
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Ghi nhận và theo dõi điểm số chi tiết từ Mentor
          </Typography>
        </Box>
      </Box>

      {/* Bảng Dữ Liệu */}
      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
        <DataTable
          title=""
          columns={columns}
          data={data}
          loading={loading}
          onEdit={isMentor ? (result) => handleOpenDialog(result) : null}
          onAdd={isMentor ? () => handleOpenDialog() : null}
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
      </Paper>

      {/* Modal Thêm/Sửa bằng STACK (Không dùng Grid) */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm" // Thu nhỏ lại thành sm vì xếp dọc không cần rộng quá
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, overflow: "visible" },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "#333" }}>
            {editingResult ? "Cập nhật kết quả đánh giá" : "Thêm kết quả đánh giá mới"}
          </Typography>
        </DialogTitle>
        <Divider />

        <DialogContent sx={{ pt: 3 }}>
          {/* Thông tin cơ bản */}
          <Stack spacing={2.5}>
            <TextField
              fullWidth
              label="Mã phân công (Assignment ID)"
              value={formData.assignmentId}
              onChange={(e) => setFormData({ ...formData, assignmentId: e.target.value })}
              disabled={editingResult !== null}
            />

            <TextField
              fullWidth
              label="Mã vòng đánh giá (Round ID)"
              value={formData.roundId}
              onChange={(e) => {
                const id = e.target.value;
                setFormData({ ...formData, roundId: id });
                fetchCriteriaForRound(id);
              }}
            />
          </Stack>

          {/* Vùng chi tiết điểm */}
          <Box sx={{ mt: 4, p: 2, bgcolor: '#f8f9fa', borderRadius: 2, border: '1px solid #e0e0e0' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1565c0' }}>
                Chi tiết điểm các tiêu chí
              </Typography>
              {!editingResult && (
                <Button variant="outlined" size="small" onClick={handleAddResultRow} sx={{ borderRadius: 2 }}>
                  + Thêm tiêu chí
                </Button>
              )}
            </Box>

            <Stack spacing={3}>
              {formData.results.map((item, index) => (
                <Paper key={index} elevation={0} sx={{ p: 2.5, border: '1px solid #ddd', borderRadius: 2 }}>
                  {/* Mỗi kết quả cũng xếp dọc hoàn toàn */}
                  <Stack spacing={2}>
                    <Autocomplete
                      fullWidth
                      options={suggestedCriteria}
                      getOptionLabel={(option) => option.criterionName || ""}
                      value={suggestedCriteria.find(c => c.criterionId == item.criterionId) || null}
                      isOptionEqualToValue={(option, value) => option.criterionId == value.criterionId}
                      onChange={(e, newValue) => {
                        handleResultChange(index, "criterionId", newValue ? newValue.criterionId : "");
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label="Chọn tiêu chí" />
                      )}
                    />

                    <TextField
                      fullWidth
                      label="Điểm số"
                      type="number"
                      inputProps={{ step: "0.1", min: "0" }}
                      value={item.score}
                      onChange={(e) => handleResultChange(index, "score", e.target.value)}
                    />

                    <TextField
                      fullWidth
                      label="Nhận xét"
                      multiline
                      rows={2}
                      value={item.comments}
                      onChange={(e) => handleResultChange(index, "comments", e.target.value)}
                    />

                    <Box sx={{ textAlign: 'right' }}>
                      <Button
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleRemoveResultRow(index)}
                        disabled={formData.results.length === 1}
                      >
                        Xóa dòng này
                      </Button>
                    </Box>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Box>
        </DialogContent>

        <Divider />
        <DialogActions sx={{ p: 2.5, justifyContent: "flex-end" }}>
          <Button onClick={handleCloseDialog} sx={{ fontWeight: "bold", color: "#666" }}>
            Hủy bỏ
          </Button>
          <Button onClick={handleSave} variant="contained" disabled={loading} sx={{ px: 4, borderRadius: 2, fontWeight: "bold" }}>
            {loading ? "Đang lưu..." : "Lưu Kết Quả"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AssessmentResultsManagement;