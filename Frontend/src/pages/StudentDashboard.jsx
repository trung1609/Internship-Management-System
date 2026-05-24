import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { studentApi } from "../api/resourceApi";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Avatar,
  Divider
} from "@mui/material";

// Import các Icon để làm đẹp giao diện
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import CakeOutlinedIcon from '@mui/icons-material/CakeOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentInfo, setStudentInfo] = useState(null);

  useEffect(() => {
    const fetchStudentInfo = async () => {
      try {
        setError(null);
        setLoading(true);
        const studentInfo = await studentApi.getCurrentStudentInfo();
        setStudentInfo(studentInfo);
      } catch (err) {
        console.error("Failed to load student info:", err);
        setError("Error loading information: " + (err.message || "Unknown error"));
      } finally {
        setLoading(false);
      }
    };
    fetchStudentInfo();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  // Khai báo một Component nhỏ để render từng dòng thông tin cho code gọn gàng
  const InfoItem = ({ icon, label, value }) => (
    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 3 }}>
      <Box sx={{ color: "primary.main", mt: 0.5 }}>
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

      {/* Banner Chào mừng */}
      <Paper elevation={0} sx={{ p: 3, mb: 4, bgcolor: "#e3f2fd", color: "#1565c0", borderRadius: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 0.5 }}>
          Welcome back, {studentInfo?.data?.fullName || user?.username}! 👋
        </Typography>
        <Typography variant="body2">
          Manage your internship applications and track your progress.
        </Typography>
      </Paper>

      {/* Profile Card kiểu mới */}
      <Paper elevation={2} sx={{ borderRadius: 3, overflow: "hidden" }}>
        
        {/* Phần 1: Header Profile (Có màu nền nhạt, chứa Avatar và Tên) */}
        <Box sx={{ p: 4, bgcolor: "#fafafa", display: "flex", alignItems: "center", gap: 3 }}>
          <Avatar 
            sx={{ width: 90, height: 90, bgcolor: "primary.main", fontSize: "2rem", boxShadow: 2 }}
          >
            {/* Hiển thị chữ cái đầu tiên của tên */}
            {studentInfo?.data?.fullName?.charAt(0).toUpperCase() || "S"}
          </Avatar>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: "bold", color: "#1976d2", mb: 0.5 }}>
              {studentInfo?.data?.fullName || "Chưa cập nhật tên"}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" sx={{ mb: 1 }}>
              {studentInfo?.data?.major || "Chưa cập nhật ngành học"}
            </Typography>
            <Chip
              label={user?.isActive ? "Tài khoản Đang hoạt động" : "Tài khoản Bị khóa"}
              color={user?.isActive ? "success" : "error"}
              size="small"
              sx={{ fontWeight: "bold", px: 1 }}
            />
          </Box>
        </Box>

        <Divider />

        {/* Phần 2: Chi tiết thông tin (Sử dụng Icon và không dùng Box viền xám) */}
        <Box sx={{ p: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 4, color: "#333" }}>
            Chi tiết liên hệ & Học vấn
          </Typography>

          <Grid container spacing={x => 4}>
            {/* Cột trái */}
            <Grid item xs={12} md={6}>
              <InfoItem 
                icon={<BadgeOutlinedIcon />} 
                label="Mã Sinh Viên (Student Code)" 
                value={studentInfo?.data?.studentCode} 
              />
              <InfoItem 
                icon={<EmailOutlinedIcon />} 
                label="Địa chỉ Email" 
                value={studentInfo?.data?.email} 
              />
              <InfoItem 
                icon={<LocalPhoneOutlinedIcon />} 
                label="Số Điện Thoại" 
                value={studentInfo?.data?.phoneNumber} 
              />
              <InfoItem 
                icon={<AccountCircleOutlinedIcon />} 
                label="Tên Đăng Nhập (Username)" 
                value={user?.username} 
              />
            </Grid>

            {/* Cột phải */}
            <Grid item xs={12} md={6}>
              <InfoItem 
                icon={<SchoolOutlinedIcon />} 
                label="Lớp Danh Nghĩa (Class)" 
                value={studentInfo?.data?.classRoom} 
              />
              <InfoItem 
                icon={<CakeOutlinedIcon />} 
                label="Ngày Sinh (Date of Birth)" 
                value={studentInfo?.data?.dateOfBirth} 
              />
              <InfoItem 
                icon={<HomeOutlinedIcon />} 
                label="Địa Chỉ Thường Trú (Address)" 
                value={studentInfo?.data?.address} 
              />
            </Grid>
          </Grid>
        </Box>

      </Paper>
    </Box>
  );
};

export default StudentDashboard;