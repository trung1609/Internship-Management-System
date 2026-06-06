import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MentorDashboard from "./pages/MentorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import UserDetailPage from "./pages/UserDetailPage";
import MainDashboard from "./pages/MainDashboard";
import { AppLayout } from "./components/AppLayout";

// Management Pages
import UsersManagement from "./pages/management/UsersManagement";
import StudentsManagement from "./pages/management/StudentsManagement";
import MentorsManagement from "./pages/management/MentorsManagement";
import InternshipPhasesManagement from "./pages/management/InternshipPhasesManagement";
import InternshipAssignmentsManagement from "./pages/management/InternshipAssignmentsManagement";
import AssessmentRoundsManagement from "./pages/management/AssessmentRoundsManagement";
import EvaluationCriteriaManagement from "./pages/management/EvaluationCriteriaManagement";
import AssessmentResultsManagement from "./pages/management/AssessmentResultsManagement";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import AssessmentRoundDetail from "./pages/management/AssessmentRoundDetail";
import AssessmentResultDetail from "./pages/management/AssessmentResultDetail";
import LandingPage from "./pages/LandingPage";
import AssignedMentor from "./pages/AssignedMentor";
import AssignedStudents from "./pages/AssignedStudents";
import { AnimatePresence } from "framer-motion";

function App() {
  const location = useLocation();
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        theme="colored"
      />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<LandingPage />} />

          {/* Dashboard Routes */}
          <Route element={<ProtectedRoute />}>
            {/* Route này thường dành cho Student, hoặc làm trang chuyển tiếp */}
            <Route path="/dashboard" element={<AppLayout><MainDashboard /></AppLayout>} />

            {/* Bất kỳ ai cũng có thể xem chi tiết profile user (nếu cần) */}
            <Route path="/user/:userId" element={<AppLayout><UserDetailPage /></AppLayout>} />

            <Route path="/admin-dashboard" element={<AppLayout><AdminDashboard /></AppLayout>} />

            {/* Toàn bộ các trang Quản lý (Management) đặt trong này */}
            <Route path="/management/users" element={<AppLayout><UsersManagement /></AppLayout>} />
            <Route path="/management/students" element={<AppLayout><StudentsManagement /></AppLayout>} />
            <Route path="/management/mentors" element={<AppLayout><MentorsManagement /></AppLayout>} />
            <Route path="/management/phases" element={<AppLayout><InternshipPhasesManagement /></AppLayout>} />
            <Route path="/management/assignments" element={<AppLayout><InternshipAssignmentsManagement /></AppLayout>} />
            <Route path="/management/assessment-rounds" element={<AppLayout><AssessmentRoundsManagement /></AppLayout>} />
            <Route path="/management/evaluation-criteria" element={<AppLayout><EvaluationCriteriaManagement /></AppLayout>} />
            <Route path="/management/assessment-results" element={<AppLayout><AssessmentResultsManagement /></AppLayout>} />

            <Route path="/mentor-dashboard" element={<AppLayout><MentorDashboard /></AppLayout>} />
            {/* Ví dụ: Chi tiết sinh viên thì cả Admin và Mentor phụ trách đều xem được */}
            <Route path="/admin/assessment-rounds/:id" element={<AppLayout><AssessmentRoundDetail /></AppLayout>} />
            <Route path="/admin/assessment-results/:id" element={<AppLayout><AssessmentResultDetail /></AppLayout>} />
            <Route path="/my-mentor" element={<AppLayout><AssignedMentor /></AppLayout>} />
            <Route path="/my-students" element={<AppLayout><AssignedStudents /></AppLayout>} />
          </Route>
          {/* Bắt các đường dẫn không tồn tại -> Đẩy về login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AnimatePresence >
    </>
  );
}

export default App;
