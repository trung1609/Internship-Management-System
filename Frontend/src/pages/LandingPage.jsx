import { Box, Typography, Button, Container, AppBar, Toolbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      // Màu nền Gradient hiện đại, đậm chất IT
      background: 'linear-gradient(135deg, #001f3f 0%, #005A9C 100%)',
      color: 'white',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Các hình tròn mờ trang trí nền (Background Shapes) */}
      <Box sx={{ position: 'absolute', top: '-10%', left: '-5%', width: '300px', height: '300px', bgcolor: 'rgba(255,255,255,0.05)', borderRadius: '50%', zIndex: 0 }} />
      <Box sx={{ position: 'absolute', bottom: '-15%', right: '-5%', width: '500px', height: '500px', bgcolor: 'rgba(255,255,255,0.03)', borderRadius: '50%', zIndex: 0 }} />

      {/* Navbar trong suốt */}
      <AppBar position="static" elevation={0} sx={{ background: 'transparent', zIndex: 1 }}>
        <Toolbar sx={{ justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: 1 }}>
            INTERNSHIP<span style={{ color: '#64b5f6' }}>SYSTEM</span>
          </Typography>
          <Box>
            <Button color="inherit" onClick={() => navigate('/login')} sx={{ mr: 2, fontWeight: 'bold' }}>
              Đăng nhập
            </Button>
            <Button 
              variant="contained" 
              onClick={() => navigate('/register')}
              sx={{ bgcolor: '#fff', color: '#005A9C', fontWeight: 'bold', '&:hover': { bgcolor: '#e0e0e0' } }}
            >
              Đăng ký
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero Section (Căn giữa) */}
      <Container sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', maxWidth: '800px' }}>
          <Typography variant="h2" sx={{ fontWeight: 900, mb: 3, textShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
            Quản lý thực tập <br/>
            <span style={{ color: '#90caf9' }}>chuyên nghiệp & hiệu quả</span>
          </Typography>
          
          <Typography variant="h6" sx={{ mb: 5, fontWeight: 400, opacity: 0.9, lineHeight: 1.6 }}>
            Nền tảng kết nối sinh viên IT, cố vấn và học viện. Tối ưu hóa quy trình theo dõi, 
            đánh giá tiêu chí và báo cáo kết quả đồ án một cách minh bạch nhất.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center' }}>
            <Button 
              variant="contained" 
              size="large" 
              startIcon={<LoginIcon />}
              onClick={() => navigate('/login')} 
              sx={{ px: 4, py: 1.5, fontSize: '1.1rem', borderRadius: 8, bgcolor: '#1976d2', boxShadow: '0 8px 16px rgba(0,0,0,0.3)' }}
            >
              Đăng nhập hệ thống
            </Button>
            <Button 
              variant="outlined" 
              size="large" 
              startIcon={<PersonAddIcon />}
              onClick={() => navigate('/register')} 
              sx={{ px: 4, py: 1.5, fontSize: '1.1rem', borderRadius: 8, color: '#fff', borderColor: 'rgba(255,255,255,0.5)', '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.1)' } }}
            >
              Tạo tài khoản
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingPage;