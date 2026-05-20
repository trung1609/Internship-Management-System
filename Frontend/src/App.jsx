import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboard from './pages/StudentDashboard';
import MentorDashboard from './pages/MentorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import StudentDetailPage from './pages/StudentDetailPage';
import MentorDetailPage from './pages/MentorDetailPage';
import UserDetailPage from './pages/UserDetailPage';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/dashboard" element={<StudentDashboard />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/mentor-dashboard" element={<MentorDashboard />} />

      {/* Detail Routes */}
      <Route path="/student/:studentId" element={<StudentDetailPage />} />
      <Route path="/mentor/:mentorId" element={<MentorDetailPage />} />
      <Route path="/user/:userId" element={<UserDetailPage />} />
    </Routes>
  );
}

export default App;