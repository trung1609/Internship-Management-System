import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  Avatar,
  Divider,
  Chip
} from "@mui/material";
import { authApi } from "../api/authApi";

// Import Icons cho Admin
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';

const AdminDashboard = () => {
  const [adminInfo, setAdminInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const response = await authApi.getMe();
        setAdminInfo(response);
      } catch (err) {
        console.error("Error loading admin:", err);
        setError("Failed to load admin information");
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress />
      </Box>
    );

  // Component tái sử dụng để hiển thị từng dòng thông tin
  const InfoItem = ({ icon, label, value }) => (
    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 3 }}>
      <Box sx={{ color: "#7b1fa2", mt: 0.5 }}>
        {icon}
      </Box>
      <Box>
        <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 0.5 }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500, color: "#333" }}>
          {value || "N/A"}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Banner Admin */}
      <Paper elevation={0} sx={{
          p: 2.5,
          background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
          color: "white",
          borderBottom: "2px solid rgba(255,255,255,0.1)",
        }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 0.5 }}>
          Admin Control Center ⚡
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          Welcome back, {adminInfo?.data?.username || "Administrator"}! Manage the system effectively.
        </Typography>
      </Paper>

      {/* Profile Card Admin */}
      <Paper elevation={2} sx={{ borderRadius: 3, overflow: "hidden" }}>
        
        <Box sx={{ p: 4, bgcolor: "#fafafa", display: "flex", alignItems: "center", gap: 3 }}>
          <Avatar 
            sx={{ width: 90, height: 90, bgcolor: "#4a148c", fontSize: "2.5rem", boxShadow: 2 }}
          >
            {adminInfo?.data?.username?.charAt(0).toUpperCase() || "A"}
          </Avatar>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: "bold", color: "#4a148c", mb: 0.5 }}>
              {adminInfo?.data?.username || "Administrator"}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AdminPanelSettingsOutlinedIcon fontSize="small" /> System Administrator
            </Typography>
            <Chip
              label={adminInfo?.data?.isActive ? "Hệ thống Đang hoạt động" : "Tài khoản Bị khóa"}
              color={adminInfo?.data?.isActive ? "success" : "error"}
              size="small"
              sx={{ fontWeight: "bold", px: 1 }}
            />
          </Box>
        </Box>

        <Divider />

        <Box sx={{ p: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 4, color: "#333" }}>
            Admin User Profile
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <InfoItem 
                icon={<AccountCircleOutlinedIcon />} 
                label="Tên Đăng Nhập (Username)" 
                value={adminInfo?.data?.username} 
              />
              <InfoItem 
                icon={<EmailOutlinedIcon />} 
                label="Địa chỉ Email" 
                value={adminInfo?.data?.email} 
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <InfoItem 
                icon={<SecurityOutlinedIcon />} 
                label="Vai trò (Role)" 
                value={adminInfo?.data?.role || "ROLE_ADMIN"} 
              />
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default AdminDashboard;