import { useState, useEffect } from "react";
import { DataTable } from "../../components/DataTable";
import { useContext } from "react";
import { internshipPhaseApi } from "../../api/resourceApi";
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
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";

const InternshipPhasesManagement = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
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
    isDeleted: false,
  });

  useEffect(() => {
    fetchPhases();
  }, [page, rowsPerPage, search]);

  const fetchPhases = async () => {
    try {
      setLoading(true);
      const response = await internshipPhaseApi.getAllPhases(
        search,
        page,
        rowsPerPage,
      );
      setData(response?.content || []);
      setTotalCount(response?.totalElements || 0);
    } catch (err) {
      console.error("Error status:", err?.response?.status);
      console.error("Error data:", err?.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (phase = null) => {
    if (phase) {
      setEditingPhase(phase);

      const formatToISO = (dateStr) => {
        if (!dateStr) return "";
        if (dateStr.includes("-")) return dateStr;
        if (dateStr.includes("/")) {
          const [day, month, year] = dateStr.split("/");
          return `${year}-${month}-${day}`;
        }
        return dateStr;
      };

      setFormData({
        phaseName: phase.phaseName || "",
        description: phase.description || "",
        startDate: formatToISO(phase.startDate),
        endDate: formatToISO(phase.endDate),
        isDeleted: phase.isDeleted || false,
      });
    } else {
      setEditingPhase(null);
      setFormData({
        phaseName: "",
        description: "",
        startDate: "",
        endDate: "",
        isDeleted: false,
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

      const payload = { ...formData };

      console.log("Payload before date processing:", payload);

      if (!payload.startDate || payload.startDate.trim() === "") payload.startDate = null;
      if (!payload.endDate || payload.endDate.trim() === "") payload.endDate = null;

      if (editingPhase) {
        await internshipPhaseApi.updatePhase(editingPhase.id, payload);
        toast.success("Cập nhật phase thành công!");
      } else {
        await internshipPhaseApi.createPhase(payload);
        toast.success("Thêm phase thành công!");
      }
      handleCloseDialog();
      fetchPhases();
    } catch (err) {
      console.error("Error saving phase:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (dataFormTable) => {
    const targetId = dataFormTable.phaseId || dataFormTable.id;

    try {
      setLoading(true);
      await internshipPhaseApi.deletePhase(targetId);
      toast.success("Xóa phase thành công!");
      fetchPhases();
    } catch (err) {
      console.error("Error deleting phase:", err);
    } finally {
      setLoading(false);
    }
  };

  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === "ADMIN" || user?.role === "ROLE_ADMIN";

  const columns = [
    { field: "id", label: "ID" },
    { field: "phaseName", label: "Phase Name" },
    { field: "description", label: "Description" },
    { field: "startDate", label: "Start Date" },
    { field: "endDate", label: "End Date" },
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
        title="Internship Phases Management"
        columns={columns}
        data={data}
        loading={loading}
        onEdit={isAdmin ? (phase) => handleOpenDialog(phase) : null}
        onDelete={isAdmin ? handleDelete : null}
        onAdd={isAdmin ? () => handleOpenDialog() : null}
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
          <FormControlLabel
            control={
              <Switch
                checked={!formData.isDeleted}
                onChange={(e) =>
                  setFormData({ ...formData, isDeleted: !e.target.checked })}
                color="primary"
              />
            }
            label={formData.isDeleted ? "Trạng thái: Đang khóa" : "Trạng thái: Đang hoạt động"}
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

export default InternshipPhasesManagement;
