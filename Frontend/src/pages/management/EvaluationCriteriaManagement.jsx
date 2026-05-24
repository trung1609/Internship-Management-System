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
  FormControlLabel,
  Switch,
} from "@mui/material";

const EvaluationCriteriaManagement = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCriteria, setEditingCriteria] = useState(null);
  const [formData, setFormData] = useState({
    criterionName: "",
    description: "",
    maxScore: "",
    isDeleted: false,
  });

  useEffect(() => {
    fetchCriteria();
  }, [page, rowsPerPage, search]);

  const fetchCriteria = async () => {
    try {
      setLoading(true);
      const response = await evaluationCriteriaApi.getAllCriteria(
        search,
        page,
        rowsPerPage,
      );
      setData(response?.content || []);
      setTotalCount(response?.totalElements || 0);
    } catch (err) {
      console.error("Error loading criteria:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (criteria = null) => {
    if (criteria) {
      setEditingCriteria(criteria);
      setFormData({
        criterionName: criteria.criterionName || "",
        description: criteria.description || "",
        maxScore: criteria.maxScore || "",
        isDeleted: criteria.isDeleted || false,
      });
    } else {
      setEditingCriteria(null);
      setFormData({
        criterionName: "",
        description: "",
        maxScore: "",
        isDeleted: false,
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
      console.error("Error saving criteria:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (dataFormTable) => {

    const targetId = dataFormTable.id;

    try {
      setLoading(true);
      await evaluationCriteriaApi.deleteCriteria(targetId);
      fetchCriteria();
    } catch (err) {
      console.error("Error deleting criteria:", err);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: "id", label: "ID" },
    { field: "criterionName", label: "Criteria Name" },
    { field: "description", label: "Description" },
    { field: "maxScore", label: "Max Score" },
    {
      field: "isDeleted",
      label: "Active",
      render: (isDeleted) => (
        <span style={{
          color: isDeleted ? "red" : "green",
          fontWeight: "bold"
        }}>
          {isDeleted ? "Đã khóa" : "Hoạt động"}
        </span>
      ),
    },
  ];

  return (
    <Box>
      <DataTable
        title="Evaluation Criteria Management"
        columns={columns}
        data={data}
        loading={loading}
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
            value={formData.criterionName}
            onChange={(e) =>
              setFormData({ ...formData, criterionName: e.target.value })
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
          <FormControlLabel
            control={
              <Switch
                checked={!formData.isDeleted}
                onChange={(e) => setFormData({ ...formData, isDeleted: !e.target.checked })}
                color="primary"
              />
            }
            label={formData.isDeleted ? "Trạng thái: Đã khóa" : "Trạng thái: Hoạt động"}
            sx={{ mt: 2 }}
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
