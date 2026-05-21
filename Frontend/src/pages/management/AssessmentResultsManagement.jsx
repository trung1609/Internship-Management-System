import { useState, useEffect } from "react";
import { DataTable } from "../../components/DataTable";
import { assessmentResultApi } from "../../api/resourceApi";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

const AssessmentResultsManagement = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingResult, setEditingResult] = useState(null);
  const [formData, setFormData] = useState({
    score: "",
    comments: "",
    assignmentId: "",
  });

  useEffect(() => {
    fetchResults();
  }, [page, rowsPerPage, search]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await assessmentResultApi.getAllResults(
        null,
        page,
        rowsPerPage,
        search,
      );
      setData(response?.content || []);
      setTotalCount(response?.totalElements || 0);
    } catch (err) {
      setError("Error loading data: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (result = null) => {
    if (result) {
      setEditingResult(result);
      setFormData({
        score: result.score || "",
        comments: result.comments || "",
        assignmentId: result.assignmentId || "",
      });
    } else {
      setEditingResult(null);
      setFormData({
        score: "",
        comments: "",
        assignmentId: "",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingResult(null);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      if (editingResult) {
        await assessmentResultApi.updateResult(editingResult.id, formData);
      } else {
        await assessmentResultApi.createResult(formData);
      }
      handleCloseDialog();
      fetchResults();
    } catch (err) {
      setError("Error saving data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: "id", label: "ID" },
    { field: "assignmentId", label: "Assignment ID" },
    { field: "score", label: "Score" },
    { field: "comments", label: "Comments" },
  ];

  return (
    <Box>
      <DataTable
        title="Assessment Results Management"
        columns={columns}
        data={data}
        loading={loading}
        error={error}
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

      {/* Add/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingResult
            ? "Cập nhật kết quả đánh giá"
            : "Thêm kết quả đánh giá mới"}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Mã phân công"
            value={formData.assignmentId}
            onChange={(e) =>
              setFormData({ ...formData, assignmentId: e.target.value })
            }
            disabled={editingResult !== null}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Điểm số"
            type="number"
            inputProps={{ step: "0.1", min: "0" }}
            value={formData.score}
            onChange={(e) =>
              setFormData({ ...formData, score: e.target.value })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Nhận xét"
            value={formData.comments}
            onChange={(e) =>
              setFormData({ ...formData, comments: e.target.value })
            }
            multiline
            rows={3}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button onClick={handleSave} variant="contained">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AssessmentResultsManagement;
