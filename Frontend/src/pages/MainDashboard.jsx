import { useContext } from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";
import { AuthContext } from "../context/AuthContext";

const MainDashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Welcome, {user?.fullName || user?.username}!
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 3,
          mb: 3,
        }}
      >
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Role
            </Typography>
            <Typography variant="h5">
              {user?.role === "ADMIN" || user?.role === "ROLE_ADMIN"
                ? "Administrator"
                : user?.role === "MENTOR" || user?.role === "ROLE_MENTOR"
                  ? "Mentor"
                  : "Student"}
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Email
            </Typography>
            <Typography variant="h6">{user?.email}</Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Status
            </Typography>
            <Typography variant="h6">
              {user?.isActive ? "Active" : "Inactive"}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            User Guide
          </Typography>
          <Typography sx={{ mb: 1 }}>
            Use the left menu to navigate to different features of the system.
            Depending on your role, you will have access to different functions.
          </Typography>
          <Typography>
            • <strong>Admin:</strong> Manage the entire system
          </Typography>
          <Typography>
            • <strong>Mentor:</strong> Manage students and assess results
          </Typography>
          <Typography>
            • <strong>Student:</strong> View personal information and assessment
            results
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default MainDashboard;
