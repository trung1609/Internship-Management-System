import { useState, useEffect } from "react";
import { DataTable } from "../../components/DataTable";
import { internshipPhaseApi } from "../../api/resourceApi";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

const InternshipPhasesManagement = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPhase, setEditingPhase] = useState(null);
  const [formData, setFormData] = useState({
    phaseName: "",
    description: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    fetchPhases();
  }, [page, rowsPerPage, search]);

  const fetchPhases = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await internshipPhaseApi.getAllPhases(
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

  const handleOpenDialog = (phase = null) => {
    if (phase) {
      setEditingPhase(phase);
      setFormData({
        phaseName: phase.phaseName || "",
        description: phase.description || "",
        startDate: phase.startDate || "",
        endDate: phase.endDate || "",
      });
    } else {
      setEditingPhase(null);
      setFormData({
        phaseName: "",
        description: "",
        startDate: "",
        endDate: "",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingPhase(null);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      if (editingPhase) {
        await internshipPhaseApi.updatePhase(editingPhase.id, formData);
      } else {
        await internshipPhaseApi.createPhase(formData);
      }
      handleCloseDialog();
      fetchPhases();
    } catch (err) {
      setError("Error saving data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (phaseId) => {
    try {
      setLoading(true);
      await internshipPhaseApi.deletePhase(phaseId);
      fetchPhases();
    } catch (err) {
      setError("Error deleting data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: "id", label: "ID" },
    { field: "phaseName", label: "Phase Name" },
    { field: "description", label: "Description" },
    { field: "startDate", label: "Start Date" },
    { field: "endDate", label: "End Date" },
  ];

  return (
    <Box>
      <DataTable
        title="Internship Phases Management"
        columns={columns}
        data={data}
        loading={loading}
        error={error}
        onEdit={(phase) => handleOpenDialog(phase)}
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
          {editingPhase ? "Update Phase" : "Add New Phase"}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Phase Name"
            value={formData.phaseName}
            onChange={(e) =>
              setFormData({ ...formData, phaseName: e.target.value })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
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
            label="Start Date"
            type="date"
            value={formData.startDate}
            onChange={(e) =>
              setFormData({ ...formData, startDate: e.target.value })
            }
            InputLabelProps={{ shrink: true }}
            margin="normal"
          />
          <TextField
            fullWidth
            label="End Date"
            type="date"
            value={formData.endDate}
            onChange={(e) =>
              setFormData({ ...formData, endDate: e.target.value })
            }
            InputLabelProps={{ shrink: true }}
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

export default InternshipPhasesManagement;
