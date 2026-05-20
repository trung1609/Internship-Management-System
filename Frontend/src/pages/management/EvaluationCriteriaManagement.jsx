import { useState, useEffect } from "react";
import { DataTable } from "../../components/DataTable";
import { evaluationCriteriaApi } from "../../api/resourceApi";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

const EvaluationCriteriaManagement = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCriteria, setEditingCriteria] = useState(null);
  const [formData, setFormData] = useState({
    criteriaName: "",
    description: "",
    maxScore: "",
  });

  useEffect(() => {
    fetchCriteria();
  }, [page, rowsPerPage, search]);

  const fetchCriteria = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await evaluationCriteriaApi.getAllCriteria(
        search,
        page,
        rowsPerPage,
      );
      setData(response?.data?.content || []);
      setTotalCount(response?.data?.totalElements || 0);
    } catch (err) {
      setError("Error loading data: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (criteria = null) => {
    if (criteria) {
      setEditingCriteria(criteria);
      setFormData({
        criteriaName: criteria.criteriaName || "",
        description: criteria.description || "",
        maxScore: criteria.maxScore || "",
      });
    } else {
      setEditingCriteria(null);
      setFormData({
        criteriaName: "",
        description: "",
        maxScore: "",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCriteria(null);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      if (editingCriteria) {
        await evaluationCriteriaApi.updateCriteria(
          editingCriteria.id,
          formData,
        );
      } else {
        await evaluationCriteriaApi.createCriteria(formData);
      }
      handleCloseDialog();
      fetchCriteria();
    } catch (err) {
      setError("Error saving data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (criteriaId) => {
    try {
      setLoading(true);
      await evaluationCriteriaApi.deleteCriteria(criteriaId);
      fetchCriteria();
    } catch (err) {
      setError("Error deleting data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: "id", label: "ID" },
    { field: "criteriaName", label: "Criteria Name" },
    { field: "description", label: "Description" },
    { field: "maxScore", label: "Max Score" },
  ];

  return (
    <Box>
      <DataTable
        title="Evaluation Criteria Management"
        columns={columns}
        data={data}
        loading={loading}
        error={error}
        onEdit={(criteria) => handleOpenDialog(criteria)}
        onDelete={handleDelete}
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
          {editingCriteria ? "Update Criteria" : "Add New Criteria"}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Tên tiêu chí"
            value={formData.criteriaName}
            onChange={(e) =>
              setFormData({ ...formData, criteriaName: e.target.value })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Mô tả"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            multiline
            rows={3}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Điểm tối đa"
            type="number"
            value={formData.maxScore}
            onChange={(e) =>
              setFormData({ ...formData, maxScore: e.target.value })
            }
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

export default EvaluationCriteriaManagement;
