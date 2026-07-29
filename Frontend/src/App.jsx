import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
// Auth Pages
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
// mentor dashboard
import AssignedMentor from "./pages/mentors/AssignedMentor";

// student dashboard
import AssignedStudents from "./pages/students/AssignedStudents";
import StudentReportSubmit from "./pages/students/StudentReportSubmit";

import MainDashboard from "./pages/MainDashboard";

// Management Pages
import UsersManagement from "./pages/management/UsersManagement";
import StudentsManagement from "./pages/management/StudentsManagement";
import MentorsManagement from "./pages/management/MentorsManagement";
import InternshipPhasesManagement from "./pages/management/InternshipPhasesManagement";
import InternshipAssignmentsManagement from "./pages/management/InternshipAssignmentsManagement";
import AssessmentRoundsManagement from "./pages/management/AssessmentRoundsManagement";
import EvaluationCriteriaManagement from "./pages/management/EvaluationCriteriaManagement";
import AssessmentResultsManagement from "./pages/management/AssessmentResultsManagement";
import ReportManagement from "./pages/management/ReportManagement";
import ProtectedRoute from "./components/ProtectedRoute";
import { toast, ToastContainer } from "react-toastify";
import AssessmentRoundDetail from "./pages/management/AssessmentRoundDetail";
import AssessmentResultDetail from "./pages/management/AssessmentResultDetail";
import LandingPage from "./pages/LandingPage";
import { AnimatePresence } from "framer-motion";
import AssignmentDetail from "./pages/AssignmentDetail";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import SettingsPage from "./pages/SettingsPage";
import RequireProfileCompletion from "./components/RequireProfileCompletion";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useEffect, useRef, useState } from "react";
import { authApi } from "./api/authApi";
import { Box, CircularProgress, Typography } from "@mui/material";


const GOOGLE_CLIENT_ID = "1050982532847-dacfe3vlietuad8fht70p5bla3isf0vm.apps.googleusercontent.com";
function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const isGithubLoginProcessed = useRef(false);

  const [isProcessing, setIsProcessing] = useState(() => {
    return new URLSearchParams(window.location.search).has("code");
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get("code");

    if (code && !isGithubLoginProcessed.current) {
      isGithubLoginProcessed.current = true;
      const processGithubLogin = async () => {
        try {
          // Gửi mã code lên Spring Boot Backend để xử lý JWT
          const res = await authApi.githubLogin({ code });

          // Phân tách payload (tùy thuộc vào cấu trúc ApiResponse của bạn)
          const payload = res.data ? res.data : res;
          const jwtData = payload.data ? payload.data : payload;

          if (jwtData && jwtData.accessToken) {
            // Lưu thông tin đăng nhập vào LocalStorage
            localStorage.setItem('accessToken', jwtData.accessToken);

            toast.success("Đăng nhập bằng GitHub thành công!");

            window.history.replaceState({}, document.title, window.location.pathname);
            window.location.href = window.location.origin + window.location.pathname + "#/dashboard";
            window.location.reload();
          }
        } catch (error) {
          console.error("Lỗi đăng nhập GitHub:", error);
          toast.error("Xác thực tài khoản GitHub thất bại!");

          window.location.href = window.location.origin + window.location.pathname + "#/login";
          window.location.reload();
        }
      };

      processGithubLogin();
    }
  }, []);
  if (isProcessing) {
    return (
      <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <CircularProgress size={60} sx={{ mb: 3 }} />
        <Typography variant="h6" color="text.secondary">
          Đang xác thực tài khoản GitHub...
        </Typography>
      </Box>
    );
  }
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
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
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Dashboard Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<RequireProfileCompletion />}>
              <Route
                path="/dashboard"
                element={
                  <AppLayout>
                    <MainDashboard />
                  </AppLayout>
                }
              />

              <Route
                path="/management/users"
                element={
                  <AppLayout>
                    <UsersManagement />
                  </AppLayout>
                }
              />
              <Route
                path="/management/students"
                element={
                  <AppLayout>
                    <StudentsManagement />
                  </AppLayout>
                }
              />
              <Route
                path="/management/mentors"
                element={
                  <AppLayout>
                    <MentorsManagement />
                  </AppLayout>
                }
              />
              <Route
                path="/management/phases"
                element={
                  <AppLayout>
                    <InternshipPhasesManagement />
                  </AppLayout>
                }
              />
              <Route
                path="/management/assignments"
                element={
                  <AppLayout>
                    <InternshipAssignmentsManagement />
                  </AppLayout>
                }
              />
              <Route
                path="/management/assessment-rounds"
                element={
                  <AppLayout>
                    <AssessmentRoundsManagement />
                  </AppLayout>
                }
              />
              <Route
                path="/management/evaluation-criteria"
                element={
                  <AppLayout>
                    <EvaluationCriteriaManagement />
                  </AppLayout>
                }
              />
              <Route
                path="/management/assessment-results"
                element={
                  <AppLayout>
                    <AssessmentResultsManagement />
                  </AppLayout>
                }
              />
              <Route
                path="/admin/assessment-rounds/:id"
                element={
                  <AppLayout>
                    <AssessmentRoundDetail />
                  </AppLayout>
                }
              />
              <Route
                path="/admin/assessment-results/:id"
                element={
                  <AppLayout>
                    <AssessmentResultDetail />
                  </AppLayout>
                }
              />
              <Route
                path="/my-mentor"
                element={
                  <AppLayout>
                    <AssignedMentor />
                  </AppLayout>
                }
              />
              <Route
                path="/my-students"
                element={
                  <AppLayout>
                    <AssignedStudents />
                  </AppLayout>
                }
              />
              <Route
                path="/submit-report"
                element={
                  <AppLayout>
                    <StudentReportSubmit />
                  </AppLayout>
                }
              />
              <Route
                path="/management/reports"
                element={
                  <AppLayout>
                    <ReportManagement />
                  </AppLayout>
                }
              />
              <Route
                path="/assignments/:id"
                element={
                  <AppLayout>
                    <AssignmentDetail />
                  </AppLayout>
                }
              />
            </Route>
            <Route
              path="/settings"
              element={
                <AppLayout>
                  <SettingsPage />
                </AppLayout>
              }
            />
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AnimatePresence>
    </GoogleOAuthProvider>
  );
}

export default App;
