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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
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
      const response = await mentorApi.getAllMentors(page, rowsPerPage, search);
      setData(response?.content || []);
      setTotalCount(response?.totalElements || 0);
    } catch (err) {
      console.error("Error fetching mentors:", err);
      console.error("Error status:", err?.response?.status);
      console.error("Error data:", err?.response?.data);
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
        department: mentor.department || "",
        academicRank: mentor.academicRank || "",
      });
    } else {
      setEditingMentor(null);
      setFormData({
        userId: "",
        department: "",
        academicRank: "",
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
      console.error("Error saving mentor:", err);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: "id", label: "ID" },
    { field: "email", label: "Email" },
    { field: "fullName", label: "Full Name" },
    { field: "phoneNumber", label: "Phone Number" },
    { field: "department", label: "Department" },
    { field: "academicRank", label: "Academic Rank" },
  ];

  return (
    <Box>
      <DataTable
        title="Mentor Management"
        columns={columns}
        data={data}
        loading={loading}
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
          {!editingMentor && (
            <TextField
              fullWidth
              label="User ID"
              value={formData.userId}
              onChange={(e) =>
                setFormData({ ...formData, userId: e.target.value })
              }
              margin="normal"
            />
          )}
          {editingMentor && (
            <TextField
              fullWidth
              label="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              margin="normal"
            />
          )}
          {editingMentor && (
            <TextField
              fullWidth
              label="Họ và tên"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              margin="normal"
            />
          )}
          {editingMentor && (
            <TextField
              fullWidth
              label="Số điện thoại"
              value={formData.phoneNumber}
              onChange={(e) =>
                setFormData({ ...formData, phoneNumber: e.target.value })
              }
              margin="normal"
            />
          )}
          <TextField
            fullWidth
            label="Phòng ban"
            value={formData.department}
            onChange={(e) =>
              setFormData({ ...formData, department: e.target.value })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Học hàm/Học vị"
            value={formData.academicRank}
            onChange={(e) =>
              setFormData({ ...formData, academicRank: e.target.value })
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
