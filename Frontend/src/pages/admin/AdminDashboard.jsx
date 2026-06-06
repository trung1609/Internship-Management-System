import { useState, useEffect } from "react";
import {
  Box, Typography, Paper, CircularProgress, Alert, Avatar, Chip, Stack
} from "@mui/material";
import { authApi } from "../../api/authApi";
import { motion } from "framer-motion";
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

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
        setError("Failed to load admin information");
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}><CircularProgress /></Box>;

  // Mini Card Component gọn gàng, hiện đại
  const InfoCard = ({ icon, label, value, delay }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ delay, duration: 0.4 }}
      style={{ flex: '1 1 280px' }} // Tự động co giãn mượt mà không cần Grid
    >
      <Paper sx={{ 
        p: 3, borderRadius: 4, display: 'flex', alignItems: 'center', gap: 2.5,
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.04)',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 28px rgba(94, 53, 177, 0.12)' }
      }}>
        <Box sx={{ 
          width: 56, height: 56, borderRadius: 3, display: 'flex', justifyContent: 'center', alignItems: 'center',
          background: 'linear-gradient(135deg, rgba(94, 53, 177, 0.1) 0%, rgba(94, 53, 177, 0.05) 100%)',
          color: '#5e35b1'
        }}>
          {icon}
        </Box>
        <Box>
          <Typography variant="caption" sx={{ color: '#888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            {label}
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 700, color: '#2c3e50', mt: 0.5 }}>
            {value || "N/A"}
          </Typography>
        </Box>
      </Paper>
    </motion.div>
  );

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto' }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Hero Banner Area */}
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <Paper sx={{ 
          p: { xs: 4, md: 6 }, mb: 4, borderRadius: 5, position: 'relative', overflow: 'hidden',
          background: 'linear-gradient(135deg, #1a237e 0%, #311b92 100%)', color: 'white',
          boxShadow: '0 16px 40px rgba(49, 27, 146, 0.3)'
        }}>
          {/* Decorative Elements */}
          <Box sx={{ position: 'absolute', top: -50, right: -20, width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)' }} />
          <Box sx={{ position: 'absolute', bottom: -80, left: '10%', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)' }} />
          
          <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" spacing={4} sx={{ position: 'relative', zIndex: 1 }}>
            <motion.div initial={{ rotate: -10, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} transition={{ delay: 0.2, type: 'spring' }}>
              <Avatar sx={{ 
                width: 120, height: 120, fontSize: '3.5rem', fontWeight: 800,
                background: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)',
                border: '4px solid rgba(255, 255, 255, 0.5)', boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
              }}>
                {adminInfo?.data?.username?.charAt(0).toUpperCase() || "A"}
              </Avatar>
            </motion.div>
            
            <Box textAlign={{ xs: 'center', sm: 'left' }}>
              <Chip icon={<VerifiedUserIcon sx={{ color: '#fff !important' }}/>} label="System Administrator" 
                sx={{ background: 'rgba(255,255,255,0.15)', color: 'white', fontWeight: 600, mb: 2, backdropFilter: 'blur(5px)' }} 
              />
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, letterSpacing: '-1px' }}>
                Chào, {adminInfo?.data?.username || "Administrator"}! ⚡
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 400, opacity: 0.8 }}>
                Quản lý và theo dõi toàn bộ hệ thống tại Control Center.
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </motion.div>

      {/* Info Stats Area (No Grid, Only Flex Wrap) */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#1a237e', mb: 3, pl: 1 }}>
          Hồ Sơ Quản Trị Viên
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <InfoCard 
            delay={0.1} icon={<AccountCircleOutlinedIcon fontSize="large"/>} 
            label="Tên Đăng Nhập" value={adminInfo?.data?.username} 
          />
          <InfoCard 
            delay={0.2} icon={<EmailOutlinedIcon fontSize="large"/>} 
            label="Email Liên Hệ" value={adminInfo?.data?.email} 
          />
          <InfoCard 
            delay={0.3} icon={<SecurityOutlinedIcon fontSize="large"/>} 
            label="Phân Quyền (Role)" value={adminInfo?.data?.role || "ROLE_ADMIN"} 
          />
          <InfoCard 
            delay={0.4} icon={<AdminPanelSettingsOutlinedIcon fontSize="large"/>} 
            label="Trạng Thái Hệ Thống" 
            value={adminInfo?.data?.isActive ? "Đang hoạt động bình thường" : "Khóa / Bảo trì"} 
          />
        </Box>
      </Box>

    </Box>
  );
};

export default AdminDashboard;