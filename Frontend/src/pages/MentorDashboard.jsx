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
import { mentorApi } from "../api/resourceApi";

// Import Icons cho Mentor
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import DomainOutlinedIcon from '@mui/icons-material/DomainOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';

const MentorDashboard = () => {
  const [mentorInfo, setMentorInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  useEffect(() => {
    const fetchMentorData = async () => {
      try {
        setLoading(true);
        const res = await authApi.getMe();
        setResponse(res);

        const info = await mentorApi.getMentorInfo();
        setMentorInfo(info);
      } catch (err) {
        console.error("Error loading mentor:", err);
        setError("Failed to load mentor information");
      } finally {
        setLoading(false);
      }
    };
    fetchMentorData();
  }, []);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress />
      </Box>
    );

  // Component tái sử dụng
  const InfoItem = ({ icon, label, value }) => (
    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 3 }}>
      <Box sx={{ color: "#00796b", mt: 0.5 }}>
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

      {/* Banner Mentor */}
      <Paper elevation={0} sx={{
          p: 2.5,
          background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
          color: "white",
          borderBottom: "2px solid rgba(255,255,255,0.1)",
        }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 0.5 }}>
          Welcome back, {mentorInfo?.data?.fullName || "Mentor"}! 🎓
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          Mentor Dashboard Overview - Guide and assess your students.
        </Typography>
      </Paper>

      {/* Profile Card Mentor */}
      <Paper elevation={2} sx={{ borderRadius: 3, overflow: "hidden" }}>
        
        <Box sx={{ p: 4, bgcolor: "#f1f8e9", display: "flex", alignItems: "center", gap: 3 }}>
          <Avatar 
            sx={{ width: 90, height: 90, bgcolor: "#00695c", fontSize: "2.5rem", boxShadow: 2 }}
          >
            {mentorInfo?.data?.fullName?.charAt(0).toUpperCase() || "M"}
          </Avatar>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: "bold", color: "#004d40", mb: 0.5 }}>
              {mentorInfo?.data?.fullName || "Chưa cập nhật tên"}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <WorkspacePremiumOutlinedIcon fontSize="small" /> {mentorInfo?.data?.academicRank || "Mentor / Cố vấn"}
            </Typography>
            <Chip
              label={response?.data?.isActive ? "Tài khoản Đang hoạt động" : "Tài khoản Bị khóa"}
              color={response?.data?.isActive ? "success" : "error"}
              size="small"
              sx={{ fontWeight: "bold", px: 1 }}
            />
          </Box>
        </Box>

        <Divider />

        <Box sx={{ p: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 4, color: "#333" }}>
            Personal & Professional Information
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <InfoItem 
                icon={<BadgeOutlinedIcon />} 
                label="Họ và Tên (Full Name)" 
                value={mentorInfo?.data?.fullName} 
              />
              <InfoItem 
                icon={<EmailOutlinedIcon />} 
                label="Địa chỉ Email" 
                value={mentorInfo?.data?.email} 
              />
              <InfoItem 
                icon={<LocalPhoneOutlinedIcon />} 
                label="Số Điện Thoại" 
                value={mentorInfo?.data?.phoneNumber} 
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <InfoItem 
                icon={<DomainOutlinedIcon />} 
                label="Phòng ban / Khoa (Department)" 
                value={mentorInfo?.data?.department} 
              />
              <InfoItem 
                icon={<WorkspacePremiumOutlinedIcon />} 
                label="Học hàm / Học vị (Specialization)" 
                value={mentorInfo?.data?.academicRank} 
              />
              <InfoItem 
                icon={<AccountCircleOutlinedIcon />} 
                label="Tên Đăng Nhập (Username)" 
                value={response?.data?.username} 
              />
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default MentorDashboard;