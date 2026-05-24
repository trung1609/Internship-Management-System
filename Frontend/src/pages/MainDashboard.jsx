import { useContext } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { AuthContext } from "../context/AuthContext";

// Import 3 trang Dashboard riêng biệt của bạn vào đây
import AdminDashboard from "./AdminDashboard";
import MentorDashboard from "./MentorDashboard";
import StudentDashboard from "./StudentDashboard";

const MainDashboard = () => {
  const { user, loading } = useContext(AuthContext);

  // 1. Hiển thị loading trong lúc đợi context check token
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  // 2. Dự phòng nếu không có thông tin user
  if (!user) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error">Không tìm thấy thông tin tài khoản!</Typography>
      </Box>
    );
  }

  // 3. ĐIỀU HƯỚNG COMPONENT DỰA TRÊN ROLE
  const role = user.role;

  if (role === "ROLE_ADMIN" || role === "ADMIN") {
    // Trả về nguyên trang AdminDashboard
    return <AdminDashboard />;
  } 
  else if (role === "ROLE_MENTOR" || role === "MENTOR") {
    // Trả về nguyên trang MentorDashboard
    return <MentorDashboard />;
  } 
  else if (role === "ROLE_STUDENT" || role === "STUDENT") {
    // Trả về nguyên trang StudentDashboard
    return <StudentDashboard />;
  } 
  else {
    // Nếu role không khớp với 3 role trên
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h5" color="error">
          Vai trò (Role) của bạn không hợp lệ hoặc chưa được cấp quyền truy cập bảng điều khiển.
        </Typography>
      </Box>
    );
  }
};

export default MainDashboard;