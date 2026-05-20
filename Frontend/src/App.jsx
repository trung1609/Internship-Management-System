import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MentorDashboard from "./pages/MentorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDetailPage from "./pages/StudentDetailPage";
import MentorDetailPage from "./pages/MentorDetailPage";
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

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Dashboard Routes */}
      <Route
        path="/dashboard"
        element={
          <AppLayout>
            <MainDashboard />
          </AppLayout>
        }
      />
      <Route
        path="/admin-dashboard"
        element={
          <AppLayout>
            <AdminDashboard />
          </AppLayout>
        }
      />
      <Route
        path="/mentor-dashboard"
        element={
          <AppLayout>
            <MentorDashboard />
          </AppLayout>
        }
      />

      {/* Management Routes */}
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

      {/* Detail Routes */}
      <Route
        path="/student/:studentId"
        element={
          <AppLayout>
            <StudentDetailPage />
          </AppLayout>
        }
      />
      <Route
        path="/mentor/:mentorId"
        element={
          <AppLayout>
            <MentorDetailPage />
          </AppLayout>
        }
      />
      <Route
        path="/user/:userId"
        element={
          <AppLayout>
            <UserDetailPage />
          </AppLayout>
        }
      />
    </Routes>
  );
}

export default App;
