import { useState, useEffect } from "react";
import { DataTable } from "../../components/DataTable";
import { userApi } from "../../api/resourceApi";
import { toast } from "react-toastify"; // IMPORT TOAST ĐỂ BÁO THÀNH CÔNG
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Paper,
  Typography,
} from "@mui/material";

const UsersManagement = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullName: "",
    phoneNumber: "",
    role: "ROLE_STUDENT",
    password: "",
  });

  useEffect(() => {
    fetchUsers();
  }, [page, rowsPerPage, role, search]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      console.log("Fetching users with role:", role);
      const response = await userApi.getAllUsers(role, page, rowsPerPage, search);

      setData(response?.content || []);
      setTotalCount(response?.totalElements || 0);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        role: user.role,
      });
    } else {
      setEditingUser(null);
      setFormData({
        username: "",
        email: "",
        fullName: "",
        phoneNumber: "",
        role: "ROLE_STUDENT",
        password: "",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingUser(null);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      if (editingUser) {
        const payload = { ...formData };
        delete payload.password;

        await userApi.updateUser(editingUser.userId, payload);
        toast.success("Cập nhật người dùng thành công!"); // Báo thành công
      } else {
        await userApi.createUser(formData);
        toast.success("Thêm mới người dùng thành công!"); // Báo thành công
      }
      handleCloseDialog();
      fetchUsers();
    } catch (err) {
      // ĐÃ BỎ setError ở đây. Lỗi 400 (validation) sẽ do axiosClient bắt và báo Toast
      console.error("Error saving data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (dataFromTable) => {
    // Tự động tìm ID: hỗ trợ cả bảng User (userId), Bảng khác (id)
    const targetId = dataFromTable.userId || dataFromTable.id;

    try {
      setLoading(true);
      await userApi.deleteUser(targetId);
      toast.success("Xóa thành công!");
      fetchUsers();
    } catch (err) {
      console.error("Lỗi khi xóa dữ liệu:", err);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: "userId", label: "ID" },
    { field: "username", label: "Username" },
    { field: "email", label: "Email" },
    { field: "fullName", label: "Full Name" },
    { field: "phoneNumber", label: "Phone Number" },
    {
      field: "role",
      label: "Role",
      render: (value) =>
        value === "ROLE_ADMIN"
          ? "Admin"
          : value === "ROLE_MENTOR"
            ? "Cố vấn"
            : "Học sinh",
    },
    {
      field: "isActive",
      label: "Trạng thái",
      render: (value) => (value ? "Hoạt động" : "Không hoạt động"),
    },
  ];

  // Thay thế đoạn return trong file UsersManagement của bạn bằng code này:
  return (
    <Box sx={{ p: 3 }}>
      {/* Header trang */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#1a237e" }}>Quản lý người dùng</Typography>
          <Typography variant="body2" color="text.secondary">Quản lý và theo dõi thông tin tài khoản hệ thống</Typography>
        </Box>
        <Button
          variant="contained"
          size="large"
          startIcon={<span role="img" aria-label="add">➕</span>}
          onClick={() => handleOpenDialog()}
          sx={{ borderRadius: 2, px: 3, boxShadow: 3 }}
        >
          Thêm người dùng
        </Button>
      </Box>

      {/* Filter Card */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2, display: "flex", alignItems: "center", gap: 2 }}>
        <FormControl sx={{ minWidth: 200 }} size="small">
          <InputLabel>Lọc theo vai trò</InputLabel>
          <Select value={role} label="Lọc theo vai trò" onChange={(e) => { setRole(e.target.value); setPage(0); }}>
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="ROLE_ADMIN">Admin</MenuItem>
            <MenuItem value="ROLE_MENTOR">Cố vấn</MenuItem>
            <MenuItem value="ROLE_STUDENT">Học sinh</MenuItem>
          </Select>
        </FormControl>
      </Paper>

      {/* Table Container */}
      <Paper sx={{ p: 3, borderRadius: 3, overflow: "hidden", boxShadow: 2 }}>
        <DataTable
          columns={columns}
          data={data}
          loading={loading}
          onEdit={(user) => handleOpenDialog(user)}
          onDelete={(user) => handleDelete(user)}
          totalCount={totalCount}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(newPage) => setPage(newPage)}
          onRowsPerPageChange={(newRowsPerPage) => { setRowsPerPage(newRowsPerPage); setPage(0); }}
        />
      </Paper>

      {/* Dialog tối ưu giao diện */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 'bold', pb: 0 }}>
          {editingUser ? "Cập nhật thông tin" : "Thêm người dùng mới"}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>

          <TextField

            fullWidth

            label="Tên đăng nhập"

            value={formData.username}

            onChange={(e) =>

              setFormData({ ...formData, username: e.target.value })

            }

            disabled={editingUser !== null}

            margin="normal"

          />

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

          {!editingUser && (

            <TextField

              fullWidth

              label="Mật khẩu"

              type="password"

              value={formData.password}

              onChange={(e) =>

                setFormData({ ...formData, password: e.target.value })

              }

              margin="normal"

            />

          )}

          <TextField

            fullWidth

            label="Số điện thoại"

            value={formData.phoneNumber}

            onChange={(e) =>

              setFormData({ ...formData, phoneNumber: e.target.value })

            }

            margin="normal"

          />

          <FormControl fullWidth margin="normal">

            <InputLabel>Vai trò</InputLabel>

            <Select

              value={formData.role}

              label="Vai trò"

              onChange={(e) =>

                setFormData({ ...formData, role: e.target.value })

              }

            >

              <MenuItem value="ROLE_STUDENT">Học sinh</MenuItem>

              <MenuItem value="ROLE_MENTOR">Cố vấn</MenuItem>

              <MenuItem value="ROLE_ADMIN">Admin</MenuItem>

            </Select>

          </FormControl>

        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog} color="inherit" sx={{ fontWeight: 600 }}>Hủy</Button>
          <Button onClick={handleSave} variant="contained" sx={{ fontWeight: 600, borderRadius: 2, px: 4 }}>Lưu thông tin</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default UsersManagement; 