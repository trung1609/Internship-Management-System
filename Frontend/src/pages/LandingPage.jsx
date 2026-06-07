import { Box, Typography, Button, Container, AppBar, Toolbar, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { motion } from 'framer-motion';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(10px)" }}
      transition={{ duration: 0.4 }}
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#0f172a', // Màu nền xanh đen hiện đại
        overflow: 'hidden',
        position: 'relative',
        fontFamily: "'Inter', sans-serif"
      }}>
      {/* Background Orbs (Hiệu ứng ánh sáng nền) */}
      <Box sx={{ position: 'absolute', top: '-10%', left: '-5%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(56,189,248,0.15) 0%, rgba(15,23,42,0) 70%)', borderRadius: '50%', zIndex: 0 }} />
      <Box sx={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(15,23,42,0) 70%)', borderRadius: '50%', zIndex: 0 }} />

      {/* Navbar */}
      <AppBar position="static" elevation={0} sx={{ background: 'transparent', zIndex: 1, pt: 2 }}>
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: 1, color: '#fff' }}>
                INTERNSHIP<span style={{ color: '#38bdf8' }}>SYSTEM</span>
              </Typography>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <Stack direction="row" spacing={2}>
                <Button
                  onClick={() => navigate('/login')}
                  sx={{ color: '#cbd5e1', fontWeight: 600, '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.05)' }, borderRadius: 2, px: 3 }}
                >
                  Đăng nhập
                </Button>
                <Button
                  variant="contained"
                  onClick={() => navigate('/register')}
                  sx={{ bgcolor: '#38bdf8', color: '#0f172a', fontWeight: 700, borderRadius: 2, px: 3, boxShadow: '0 4px 14px 0 rgba(56, 189, 248, 0.39)', '&:hover': { bgcolor: '#0ea5e9', boxShadow: '0 6px 20px rgba(56, 189, 248, 0.23)' } }}
                >
                  Đăng ký
                </Button>
              </Stack>
            </motion.div>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Hero Section */}
      <Container sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, position: 'relative' }}>
        <Box sx={{ textAlign: 'center', maxWidth: '800px', mt: -10 }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
            <Typography variant="h1" sx={{ fontWeight: 900, mb: 3, fontSize: { xs: '3rem', md: '4.5rem' }, color: '#f8fafc', lineHeight: 1.1 }}>
              Quản lý thực tập <br />
              <Box component="span" sx={{ background: 'linear-gradient(to right, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                chuyên nghiệp & hiệu quả
              </Box>
            </Typography>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }}>
            <Typography variant="h6" sx={{ mb: 6, fontWeight: 400, color: '#94a3b8', lineHeight: 1.6, px: { xs: 2, md: 8 } }}>
              Nền tảng kết nối sinh viên IT, cố vấn và học viện. Tối ưu hóa quy trình theo dõi,
              đánh giá tiêu chí và báo cáo kết quả đồ án một cách minh bạch nhất.
            </Typography>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.6 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center" alignItems="center" sx={{ ml: 15 }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<LoginIcon />}
                onClick={() => navigate('/login')}
                sx={{
                  px: 4, py: 1.8, fontSize: '1.1rem', borderRadius: 3, fontWeight: 700,
                  background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
                  boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.5)',
                  '&:hover': { background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)' }
                }}
              >
                Đăng nhập hệ thống
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<PersonAddIcon />}
                onClick={() => navigate('/register')}
                sx={{
                  px: 4, py: 1.8, fontSize: '1.1rem', borderRadius: 3, fontWeight: 700,
                  color: '#fff', borderColor: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                  '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.05)' }
                }}
              >
                Tạo tài khoản mới
              </Button>
            </Stack>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingPage;