import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Alert,
} from "@mui/material";
import { mentorApi } from "../api/resourceApi";

const MentorDashboard = () => {
  const [mentorInfo, setMentorInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMentorData = async () => {
      try {
        setLoading(true);
        const response = await mentorApi.getAllMentors(0, 1);
        if (response?.data?.content && response.data.content.length > 0) {
          setMentorInfo(response.data.content[0]);
        }
      } catch (err) {
        console.error("Error loading mentor:", err);
        setError("Failed to load mentor information");
      } finally {
        setLoading(false);
      }
    };
    fetchMentorData();
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
      <Paper sx={{ p: 3, mb: 4, bgcolor: "primary.main", color: "white" }}>
        <Typography variant="h4">
          Welcome, {mentorInfo?.fullName || "Mentor"}
        </Typography>
        <Typography variant="subtitle1">Mentor Dashboard Overview</Typography>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Personal Information
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="caption" color="textSecondary">
              Full Name
            </Typography>
            <Typography variant="body1">
              {mentorInfo?.fullName || "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="caption" color="textSecondary">
              Email
            </Typography>
            <Typography variant="body1">
              {mentorInfo?.email || "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="caption" color="textSecondary">
              Specialization
            </Typography>
            <Typography variant="body1">
              {mentorInfo?.specialization || "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="caption" color="textSecondary">
              Phone
            </Typography>
            <Typography variant="body1">
              {mentorInfo?.phone || "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="caption" color="textSecondary">
              Department
            </Typography>
            <Typography variant="body1">
              {mentorInfo?.department || "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="caption" color="textSecondary">
              Status
            </Typography>
            <Typography variant="body1">
              {mentorInfo?.status || "Active"}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default MentorDashboard;
