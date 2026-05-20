import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { studentApi } from "../api/resourceApi";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";

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
        const response = await studentApi.getCurrentStudentInfo();
        setStudentInfo(response || {});
      } catch (err) {
        console.error("Failed to load student info:", err);
        setError("Error loading information: " + (err.message || "Unknown error"));
      } finally {
        setLoading(false);
      }
    };
    fetchStudentInfo();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Welcome Section */}
      <Paper
        elevation={1}
        sx={{
          p: 2.5,
          mb: 3,
          bgcolor: "#1976d2",
          color: "white",
          borderRadius: 1,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "600", mb: 0.5 }}>
          Welcome, {user?.fullName}! 👋
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          Manage your internship applications and track your progress.
        </Typography>
      </Paper>

      {/* Student Info */}
      <Paper elevation={1} sx={{ p: 2.5, borderRadius: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: "600", mb: 2 }}>
          Personal Information
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <Box
              sx={{
                p: 1.5,
                bgcolor: "#f9f9f9",
                borderRadius: 1,
                border: "1px solid #e0e0e0",
              }}
            >
              <Typography variant="caption" color="textSecondary">
                Full Name
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: "600", mt: 0.5 }}>
                {user?.fullName}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Box
              sx={{
                p: 1.5,
                bgcolor: "#f9f9f9",
                borderRadius: 1,
                border: "1px solid #e0e0e0",
              }}
            >
              <Typography variant="caption" color="textSecondary">
                Email
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: "600", mt: 0.5 }}>
                {user?.email}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Box
              sx={{
                p: 1.5,
                bgcolor: "#f9f9f9",
                borderRadius: 1,
                border: "1px solid #e0e0e0",
              }}
            >
              <Typography variant="caption" color="textSecondary">
                Phone Number
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: "600", mt: 0.5 }}>
                {user?.phoneNumber || "N/A"}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Box
              sx={{
                p: 1.5,
                bgcolor: "#f9f9f9",
                borderRadius: 1,
                border: "1px solid #e0e0e0",
              }}
            >
              <Typography variant="caption" color="textSecondary">
                Username
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: "600", mt: 0.5 }}>
                {user?.username}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Box
              sx={{
                p: 1.5,
                bgcolor: "#f9f9f9",
                borderRadius: 1,
                border: "1px solid #e0e0e0",
              }}
            >
              <Typography variant="caption" color="textSecondary">
                Status
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: "600", mt: 0.5 }}>
                <Chip
                  label={user?.isActive ? "Active" : "Inactive"}}
                  size="small"
                  color={user?.isActive ? "success" : "default"}
                />
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default StudentDashboard;
