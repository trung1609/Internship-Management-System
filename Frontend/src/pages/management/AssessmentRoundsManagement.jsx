import { useState, useEffect } from "react";
import { DataTable } from "../../components/DataTable";
import { assessmentRoundsApi } from "../../api/resourceApi";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

const AssessmentRoundsManagement = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingRound, setEditingRound] = useState(null);
  const [formData, setFormData] = useState({
    roundName: "",
    description: "",
    startDate: "",
    endDate: "",
    phaseId: "",
  });

  useEffect(() => {
    fetchRounds();
  }, [page, rowsPerPage, search]);

  const fetchRounds = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await assessmentRoundsApi.getAllRounds(
        search,
        null,
        page,
        rowsPerPage,
      );
      setData(response?.content || []);
      setTotalCount(response?.totalElements || 0);
    } catch (err) {
      setError("Error loading data: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (round = null) => {
    if (round) {
      setEditingRound(round);
      setFormData({
        roundName: round.roundName || "",
        description: round.description || "",
        startDate: round.startDate || "",
        endDate: round.endDate || "",
        phaseId: round.phaseId || "",
      });
    } else {
      setEditingRound(null);
      setFormData({
        roundName: "",
        description: "",
        startDate: "",
        endDate: "",
        phaseId: "",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingRound(null);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      if (editingRound) {
        await assessmentRoundsApi.updateRound(editingRound.id, formData);
      } else {
        await assessmentRoundsApi.createRound(formData);
      }
      handleCloseDialog();
      fetchRounds();
    } catch (err) {
      setError("Error saving data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (roundId) => {
    try {
      setLoading(true);
      await assessmentRoundsApi.deleteRound(roundId);
      fetchRounds();
    } catch (err) {
      setError("Error deleting data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: "id", label: "ID" },
    { field: "roundName", label: "Round Name" },
    { field: "description", label: "Description" },
    { field: "startDate", label: "Start Date" },
    { field: "endDate", label: "End Date" },
    { field: "phaseName", label: "Phase Name" },
  ];

  return (
    <Box>
      <DataTable
        title="Assessment Rounds Management"
        columns={columns}
        data={data}
        loading={loading}
        error={error}
        onEdit={(round) => handleOpenDialog(round)}
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
          {editingRound
            ? "Update Assessment Round"
            : "Add New Assessment Round"}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Tên vòng đánh giá"
            value={formData.roundName}
            onChange={(e) =>
              setFormData({ ...formData, roundName: e.target.value })
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
            label="Ngày bắt đầu"
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
            label="Ngày kết thúc"
            type="date"
            value={formData.endDate}
            onChange={(e) =>
              setFormData({ ...formData, endDate: e.target.value })
            }
            InputLabelProps={{ shrink: true }}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Mã giai đoạn"
            value={formData.phaseId}
            onChange={(e) =>
              setFormData({ ...formData, phaseId: e.target.value })
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

export default AssessmentRoundsManagement;
