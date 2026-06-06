import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { studentApi } from "../../api/resourceApi";
import { motion } from "framer-motion";
import {
  Box, Typography, Paper, Chip, CircularProgress, Alert, Avatar, Stack
} from "@mui/material";

import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import CakeOutlinedIcon from '@mui/icons-material/CakeOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

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
        const info = await studentApi.getCurrentStudentInfo();
        setStudentInfo(info);
      } catch (err) {
        setError("Error loading information: " + (err.message || "Unknown error"));
      } finally {
        setLoading(false);
      }
    };
    fetchStudentInfo();
  }, []);

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}><CircularProgress /></Box>;

  const InfoCard = ({ icon, label, value, delay }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.4 }}
      style={{ flex: '1 1 280px' }} 
    >
      <Paper sx={{ 
        p: 3, borderRadius: 4, display: 'flex', alignItems: 'center', gap: 2.5,
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.04)',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 28px rgba(25, 118, 210, 0.12)' }
      }}>
        <Box sx={{ 
          width: 56, height: 56, borderRadius: 3, display: 'flex', justifyContent: 'center', alignItems: 'center',
          background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(25, 118, 210, 0.05) 100%)',
          color: '#1976d2'
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

      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <Paper sx={{ 
          p: { xs: 4, md: 6 }, mb: 4, borderRadius: 5, position: 'relative', overflow: 'hidden',
          background: 'linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)', color: 'white',
          boxShadow: '0 16px 40px rgba(13, 71, 161, 0.3)'
        }}>
          <Box sx={{ position: 'absolute', top: -50, right: -20, width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)' }} />
          
          <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" spacing={4} sx={{ position: 'relative', zIndex: 1 }}>
            <motion.div initial={{ rotate: -10, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} transition={{ delay: 0.2, type: 'spring' }}>
              <Avatar sx={{ 
                width: 120, height: 120, fontSize: '3.5rem', fontWeight: 800,
                background: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)',
                border: '4px solid rgba(255, 255, 255, 0.5)', boxShadow: '0 8px 24px rgba(0,0,0,0.2)', color: '#fff'
              }}>
                {studentInfo?.data?.fullName?.charAt(0).toUpperCase() || "S"}
              </Avatar>
            </motion.div>
            
            <Box textAlign={{ xs: 'center', sm: 'left' }}>
              <Chip icon={<RocketLaunchIcon sx={{ color: '#fff !important' }}/>} label="Thực Tập Sinh" 
                sx={{ background: 'rgba(255,255,255,0.15)', color: 'white', fontWeight: 600, mb: 2, backdropFilter: 'blur(5px)' }} 
              />
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, letterSpacing: '-1px' }}>
                Chào, {studentInfo?.data?.fullName || user?.username}! 👋
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 400, opacity: 0.8 }}>
                Chào mừng bạn đến với kỳ thực tập. Hãy theo dõi tiến độ của mình tại đây.
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </motion.div>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#1565c0', mb: 3, pl: 1 }}>
          Hồ Sơ Của Bạn
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <InfoCard delay={0.1} icon={<BadgeOutlinedIcon fontSize="large"/>} label="Mã Sinh Viên" value={studentInfo?.data?.studentCode} />
          <InfoCard delay={0.2} icon={<SchoolOutlinedIcon fontSize="large"/>} label="Ngành Học" value={studentInfo?.data?.major} />
          <InfoCard delay={0.3} icon={<SchoolOutlinedIcon fontSize="large"/>} label="Lớp Danh Nghĩa" value={studentInfo?.data?.classRoom} />
          <InfoCard delay={0.4} icon={<EmailOutlinedIcon fontSize="large"/>} label="Email Liên Hệ" value={studentInfo?.data?.email} />
          <InfoCard delay={0.5} icon={<LocalPhoneOutlinedIcon fontSize="large"/>} label="Số Điện Thoại" value={studentInfo?.data?.phoneNumber} />
          <InfoCard delay={0.6} icon={<CakeOutlinedIcon fontSize="large"/>} label="Ngày Sinh" value={studentInfo?.data?.dateOfBirth} />
          <InfoCard delay={0.7} icon={<HomeOutlinedIcon fontSize="large"/>} label="Địa Chỉ Thường Trú" value={studentInfo?.data?.address} />
          <InfoCard delay={0.8} icon={<AccountCircleOutlinedIcon fontSize="large"/>} label="Tên Đăng Nhập" value={user?.username} />
        </Box>
      </Box>

    </Box>
  );
};

export default StudentDashboard;