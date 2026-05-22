import { useState, useEffect } from "react";
import { DataTable } from "../../components/DataTable";
import { userApi } from "../../api/resourceApi";
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
} from "@mui/material";

const UsersManagement = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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
      setError(null);
      console.log("Fetching users with role:", role);
      const response = await userApi.getAllUsers(
        role,
        page,
        rowsPerPage,
        search,
      );
      console.log("Users API Response:", response);
      console.log("Users data content:", response?.content);
      console.log("Total count:", response?.totalElements);
      setData(response?.content || []);
      setTotalCount(response?.totalElements || 0);
    } catch (err) {
      console.error("Error fetching users:", err);
      console.error("Error status:", err?.response?.status);
      console.error("Error data:", err?.response?.data);
      setError("Error loading data: " + (err.message || "Unknown error"));
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
      } else {
        await userApi.createUser(formData);
      }
      handleCloseDialog();
      fetchUsers();
    } catch (err) {
      setError("Error saving data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    try {
      setLoading(true);
      await userApi.deleteUser(userId);
      fetchUsers();
    } catch (err) {
      setError("Error deleting data: " + err.message);
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

  return (
    <Box>
      <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
        <FormControl sx={{ width: "200px" }}>
          <InputLabel>Lọc theo vai trò</InputLabel>
          <Select
            value={role}
            label="Lọc theo vai trò"
            onChange={(e) => {
              setRole(e.target.value);
              setPage(0);
            }}
          >
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="ROLE_ADMIN">Admin</MenuItem>
            <MenuItem value="ROLE_MENTOR">Cố vấn</MenuItem>
            <MenuItem value="ROLE_STUDENT">Học sinh</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <DataTable
        title="User Management"
        columns={columns}
        data={data}
        loading={loading}
        error={error}
        onEdit={(user) => handleOpenDialog(user)}
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
      />

      {/* Add/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingUser ? "Update User" : "Add New User"}
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

export default UsersManagement;
