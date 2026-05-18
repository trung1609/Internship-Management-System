import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      <Route path="/dashboard" element={<div>Chào mừng đến trang Dashboard! (Đang xây dựng)</div>} />
      <Route path="/admin-dashboard" element={<div>Trang quản lý của Admin (Đang xây dựng)</div>} />
    </Routes>
  );
}

export default App;