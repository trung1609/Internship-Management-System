import { useState, useEffect } from "react";
import {
  Box, Typography, Paper, CircularProgress, Alert, Avatar, Chip, Stack
} from "@mui/material";
import { authApi } from "../../api/authApi";
import { mentorApi } from "../../api/resourceApi";
import { motion } from "framer-motion";

import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import DomainOutlinedIcon from '@mui/icons-material/DomainOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LightbulbCircleIcon from '@mui/icons-material/LightbulbCircle';

const MentorDashboard = () => {
  const [mentorInfo, setMentorInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  useEffect(() => {
    const fetchMentorData = async () => {
      try {
        setLoading(true);
        const [res, info] = await Promise.all([authApi.getMe(), mentorApi.getMentorInfo()]);
        setResponse(res);
        setMentorInfo(info);
      } catch (err) {
        setError("Failed to load mentor information");
      } finally {
        setLoading(false);
      }
    };
    fetchMentorData();
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
        '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 28px rgba(0, 105, 92, 0.12)' }
      }}>
        <Box sx={{ 
          width: 56, height: 56, borderRadius: 3, display: 'flex', justifyContent: 'center', alignItems: 'center',
          background: 'linear-gradient(135deg, rgba(0, 105, 92, 0.1) 0%, rgba(0, 105, 92, 0.05) 100%)',
          color: '#00695c'
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
          background: 'linear-gradient(135deg, #00695c 0%, #004d40 100%)', color: 'white',
          boxShadow: '0 16px 40px rgba(0, 77, 64, 0.3)'
        }}>
          <Box sx={{ position: 'absolute', top: -50, right: -20, width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)' }} />
          
          <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" spacing={4} sx={{ position: 'relative', zIndex: 1 }}>
            <motion.div initial={{ rotate: -10, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} transition={{ delay: 0.2, type: 'spring' }}>
              <Avatar sx={{ 
                width: 120, height: 120, fontSize: '3.5rem', fontWeight: 800,
                background: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)',
                border: '4px solid rgba(255, 255, 255, 0.5)', boxShadow: '0 8px 24px rgba(0,0,0,0.2)', color: '#fff'
              }}>
                {mentorInfo?.data?.fullName?.charAt(0).toUpperCase() || "M"}
              </Avatar>
            </motion.div>
            
            <Box textAlign={{ xs: 'center', sm: 'left' }}>
              <Chip icon={<LightbulbCircleIcon sx={{ color: '#fff !important' }}/>} label="Mentor / Giảng Viên" 
                sx={{ background: 'rgba(255,255,255,0.15)', color: 'white', fontWeight: 600, mb: 2, backdropFilter: 'blur(5px)' }} 
              />
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, letterSpacing: '-1px' }}>
                Chào, {mentorInfo?.data?.fullName || "Thầy/Cô"}! 🎓
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 400, opacity: 0.8 }}>
                Hãy cùng dẫn dắt và đánh giá tiến độ của các sinh viên thực tập.
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </motion.div>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#004d40', mb: 3, pl: 1 }}>
          Thông Tin Chuyên Môn
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <InfoCard delay={0.1} icon={<BadgeOutlinedIcon fontSize="large"/>} label="Họ và Tên" value={mentorInfo?.data?.fullName} />
          <InfoCard delay={0.2} icon={<WorkspacePremiumOutlinedIcon fontSize="large"/>} label="Học Hàm / Học Vị" value={mentorInfo?.data?.academicRank} />
          <InfoCard delay={0.3} icon={<DomainOutlinedIcon fontSize="large"/>} label="Khoa / Phòng Ban" value={mentorInfo?.data?.department} />
          <InfoCard delay={0.4} icon={<EmailOutlinedIcon fontSize="large"/>} label="Email Liên Hệ" value={mentorInfo?.data?.email} />
          <InfoCard delay={0.5} icon={<LocalPhoneOutlinedIcon fontSize="large"/>} label="Số Điện Thoại" value={mentorInfo?.data?.phoneNumber} />
          <InfoCard delay={0.6} icon={<AccountCircleOutlinedIcon fontSize="large"/>} label="Tên Đăng Nhập" value={response?.data?.username} />
        </Box>
      </Box>

    </Box>
  );
};

export default MentorDashboard;