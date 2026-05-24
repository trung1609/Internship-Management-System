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
  Typography,
  Paper,
} from "@mui/material";
import { toast } from "react-toastify";

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
        toast.success("Cập nhật mentor thành công!");
      } else {
        await mentorApi.createMentor(formData);
        toast.success("Thêm mentor thành công!");
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
    <Box sx={{ p: 3 }}>
      {/* 1. Header trang chuyên nghiệp */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#1a237e" }}>Quản lý Cố vấn</Typography>
          <Typography variant="body2" color="text.secondary">Danh sách các cố vấn trong hệ thống</Typography>
        </Box>
        <Button
          variant="contained"
          size="large"
          onClick={() => handleOpenDialog()}
          sx={{ borderRadius: 2, px: 3, boxShadow: 3 }}
        >
          Thêm mentor
        </Button>
      </Box>

      {/* 2. Bảng dữ liệu trong Paper có đổ bóng */}
      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2, overflow: "hidden" }}>
        <DataTable
          title="Mentor Management"
          columns={columns}
          data={data}
          loading={loading}
          onEdit={(mentor) => handleOpenDialog(mentor)}
          totalCount={totalCount}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(newPage) => setPage(newPage)}
          onRowsPerPageChange={(newRowsPerPage) => {
            setRowsPerPage(newRowsPerPage);
            setPage(0);
          }}
        />
      </Paper>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', borderBottom: '1px solid #eee', mb: 1 }}>
          {editingMentor ? "Cập nhật Mentor" : "Thêm mới Mentor"}
        </DialogTitle>

        {/* Giữ nguyên DialogContent */}
        <DialogContent sx={{ pt: 2 }}>
          {!editingMentor && (
            <TextField fullWidth label="User ID" value={formData.userId}
              onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
              disabled={!!editingMentor} margin="normal" />
          )}
          {editingMentor && (
            <>
              <TextField fullWidth label="Email" value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })} margin="normal" />
              <TextField fullWidth label="Họ và tên" value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} margin="normal" />
              <TextField fullWidth label="Số điện thoại" value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} margin="normal" />
            </>
          )}
          <TextField fullWidth label="Phòng ban" value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })} margin="normal" />
          <TextField fullWidth label="Học hàm/Học vị" value={formData.academicRank}
            onChange={(e) => setFormData({ ...formData, academicRank: e.target.value })} margin="normal" />
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog} color="inherit">Hủy</Button>
          <Button onClick={handleSave} variant="contained" sx={{ px: 4, borderRadius: 2 }}>Lưu</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MentorsManagement;
