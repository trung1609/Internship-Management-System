import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Avatar,
  Chip,
  Stack,
} from "@mui/material";
import { authApi } from "../../api/authApi";
import { motion } from "framer-motion";

// Các Icon dành cho Thống Kê
import GroupIcon from "@mui/icons-material/Group";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";

const AdminDashboard = () => {
  const [adminInfo, setAdminInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await authApi.getMe();
        setAdminInfo(response);
      } catch (err) {
        console.error("Lỗi", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );

  // Thẻ Thống Kê (Stat Card)
  const StatCard = ({ icon, title, value, color, delay }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      style={{ flex: "1 1 240px" }}
    >
      <Paper
        sx={{
          p: 3,
          borderRadius: 4,
          display: "flex",
          alignItems: "center",
          gap: 2.5,
          boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
          transition: "0.3s",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: `0 12px 28px ${color}20`,
          },
        }}
      >
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`,
            color: color,
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography
            variant="body2"
            sx={{
              color: "#64748b",
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="h4"
            sx={{ fontWeight: 900, color: "#1e293b", mt: 0.5 }}
          >
            {value}
          </Typography>
        </Box>
      </Paper>
    </motion.div>
  );

  return (
    <Box sx={{ maxWidth: 1200, margin: "0 auto" }}>
      {/* Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          sx={{
            p: { xs: 4, md: 6 },
            mb: 5,
            borderRadius: 5,
            position: "relative",
            overflow: "hidden",
            background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
            color: "white",
            boxShadow: "0 16px 40px rgba(15, 23, 42, 0.3)",
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems="center"
            spacing={4}
            sx={{ position: "relative", zIndex: 1 }}
          >
            <Avatar
              src={adminInfo?.data?.avatarUrl}
              sx={{
                width: 100,
                height: 100,
                fontSize: "3rem",
                fontWeight: 800,
                bgcolor: "transparent",
                border: "3px solid rgba(255,255,255,0.2)",
              }}
            >
              {!adminInfo?.data?.avatarUrl && (adminInfo?.data?.username?.charAt(0).toUpperCase() || "A")}
            </Avatar>
            <Box textAlign={{ xs: "center", sm: "left" }}>
              <Chip
                icon={<VerifiedUserIcon sx={{ color: "#10b981 !important" }} />}
                label="Control Center"
                sx={{
                  background: "rgba(255,255,255,0.1)",
                  color: "white",
                  fontWeight: 600,
                  mb: 2,
                }}
              />
              <Typography
                variant="h3"
                sx={{ fontWeight: 800, mb: 1, letterSpacing: "-1px" }}
              >
                Tổng quan Hệ thống
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: 400, color: "#94a3b8" }}
              >
                Theo dõi các chỉ số và hoạt động thực tập đang diễn ra.
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </motion.div>

      <Typography
        variant="h5"
        sx={{ fontWeight: 800, color: "#0f172a", mb: 3, pl: 1 }}
      >
        Chỉ số hoạt động
      </Typography>

      {/* KHU VỰC THỐNG KÊ (Thay bằng số liệu tĩnh tạm thời, sau này bạn gọi API để đổ vào) */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
        <StatCard
          delay={0.1}
          color="#3b82f6"
          icon={<GroupIcon fontSize="large" />}
          title="Tổng Người Dùng"
          value="1,248"
        />
        <StatCard
          delay={0.2}
          color="#10b981"
          icon={<BusinessCenterIcon fontSize="large" />}
          title="Kỳ Thực Tập Active"
          value="03"
        />
        <StatCard
          delay={0.3}
          color="#f59e0b"
          icon={<AssignmentIcon fontSize="large" />}
          title="Nhóm Đề Tài"
          value="84"
        />
        <StatCard
          delay={0.4}
          color="#8b5cf6"
          icon={<ShowChartIcon fontSize="large" />}
          title="Tỷ Lệ Báo Cáo"
          value="92%"
        />
      </Box>
    </Box>
  );
};

export default AdminDashboard;
