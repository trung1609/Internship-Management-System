import { useState, useEffect } from "react";
import { DataTable } from "../../components/DataTable";
import { assessmentResultApi } from "../../api/resourceApi";
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
} from "@mui/material";

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
    assignmentId: "",
    roundId: "",
    results: [{ criterionId: "", score: "", comment: "" }],
  });

  useEffect(() => {
    fetchResults();
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

  const handleOpenDialog = (result = null) => {
    if (result) {
      setEditingResult(result);
      setFormData({
        assignmentId: result.assignmentId || "",
        roundId: result.roundId || "",
        results: result.results && result.results.length > 0 
            ? result.results 
            : [{ criterionId: "", score: "", comment: "" }],
      });
    } else {
      setEditingResult(null);
      setFormData({
        assignmentId: "",
        roundId: "",
        results: [{ criterionId: "", score: "", comment: "" }],
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingResult(null);
  };

  const handleResultChange = (index, field, value) => {
    const newResults = [...formData.results];
    newResults[index][field] = value;
    setFormData({ ...formData, results: newResults });
  };

  const handleAddResultRow = () => {
    setFormData({
      ...formData,
      results: [...formData.results, { criterionId: "", score: "", comment: "" }]
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
        await assessmentResultApi.updateResult(editingResult.id, formData);
        toast.success("Cập nhật kết quả thành công!");
      } else {
        await assessmentResultApi.createResult(formData);
        toast.success("Tạo kết quả đánh giá thành công!");
      }
      handleCloseDialog();
      fetchResults();
    } catch (err) {
      console.error("Error saving assessment result:", err);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: "id", label: "ID" },
    { field: "assignmentName", label: "Tên Phân công" },
    { field: "roundName", label: "Vòng Đánh giá" },
    { field: "score", label: "Tổng điểm" },
    {
      field: "comments",
      label: "Nhận xét tóm tắt",
    },
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
                onChange={(e) => setFormData({ ...formData, roundId: e.target.value })}
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
                    <TextField
                      fullWidth
                      label="Mã tiêu chí (Criterion ID)"
                      size="small"
                      value={item.criterionId}
                      onChange={(e) => handleResultChange(index, "criterionId", e.target.value)}
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
                      value={item.comment}
                      onChange={(e) => handleResultChange(index, "comment", e.target.value)}
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