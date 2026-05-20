import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Alert,
} from "@mui/material";
import { userApi } from "../api/resourceApi";

const AdminDashboard = () => {
  const [adminInfo, setAdminInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const response = await userApi.getAllUsers("ADMIN", 0, 1);
        if (response?.data?.content && response.data.content.length > 0) {
          setAdminInfo(response.data.content[0]);
        }
      } catch (err) {
        console.error("Error loading admin:", err);
        setError("Failed to load admin information");
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
        <CircularProgress />
      </Box>
    );
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ p: 4 }}>
      <Paper sx={{ p: 3, mb: 4, bgcolor: "secondary.main", color: "white" }}>
        <Typography variant="h4">Admin Control Center</Typography>
        <Typography variant="subtitle1">
          Welcome, {adminInfo?.username || "Administrator"}
        </Typography>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Admin User Profile
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="caption" color="textSecondary">
              Username
            </Typography>
            <Typography variant="body1">
              {adminInfo?.username || "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="caption" color="textSecondary">
              Email
            </Typography>
            <Typography variant="body1">{adminInfo?.email || "N/A"}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="caption" color="textSecondary">
              Role
            </Typography>
            <Typography variant="body1">
              {adminInfo?.role || "ADMIN"}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="caption" color="textSecondary">
              Status
            </Typography>
            <Typography variant="body1">
              {adminInfo?.enabled ? "Active" : "Inactive"}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default AdminDashboard;
