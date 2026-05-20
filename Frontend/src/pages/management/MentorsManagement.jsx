import { useState, useEffect } from "react";
import { DataTable } from "../../components/DataTable";
import { mentorApi } from "../../api/resourceApi";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

const MentorsManagement = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingMentor, setEditingMentor] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    phoneNumber: "",
    specialization: "",
  });

  useEffect(() => {
    fetchMentors();
  }, [page, rowsPerPage, search]);

  const fetchMentors = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await mentorApi.getAllMentors(page, rowsPerPage, search);
      setData(response?.data?.content || []);
      setTotalCount(response?.data?.totalElements || 0);
    } catch (err) {
      console.error("Error fetching mentors:", err);
      setError("Error loading data: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (mentor = null) => {
    if (mentor) {
      setEditingMentor(mentor);
      setFormData({
        email: mentor.email || "",
        fullName: mentor.fullName || "",
        phoneNumber: mentor.phoneNumber || "",
        specialization: mentor.specialization || "",
      });
    } else {
      setEditingMentor(null);
      setFormData({
        email: "",
        fullName: "",
        phoneNumber: "",
        specialization: "",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingMentor(null);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      if (editingMentor) {
        await mentorApi.updateMentor(editingMentor.id, formData);
      } else {
        await mentorApi.createMentor(formData);
      }
      handleCloseDialog();
      fetchMentors();
    } catch (err) {
      setError("Error saving data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: "id", label: "ID" },
    { field: "email", label: "Email" },
    { field: "fullName", label: "Full Name" },
    { field: "phoneNumber", label: "Phone Number" },
    { field: "specialization", label: "Specialization" },
  ];

  return (
    <Box>
      <DataTable
        title="Mentor Management"
        columns={columns}
        data={data}
        loading={loading}
        error={error}
        onEdit={(mentor) => handleOpenDialog(mentor)}
        onAdd={() => handleOpenDialog()}
        totalCount={totalCount}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(newPage) => setPage(newPage)}
        onRowsPerPageChange={(newRowsPerPage) => {
          setRowsPerPage(newRowsPerPage);
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
          {editingMentor ? "Update Mentor" : "Add New Mentor"}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Họ và tên"
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Số điện thoại"
            value={formData.phoneNumber}
            onChange={(e) =>
              setFormData({ ...formData, phoneNumber: e.target.value })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Chuyên môn"
            value={formData.specialization}
            onChange={(e) =>
              setFormData({ ...formData, specialization: e.target.value })
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

export default MentorsManagement;
