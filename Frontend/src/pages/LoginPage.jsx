import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { AuthContext } from "../context/AuthContext";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
  Grid,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Avatar from "@mui/material/Avatar";

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      const userData = await login(data.username, data.password);
      // Always redirect to dashboard - MainDashboard handles role-based display
      navigate("/dashboard");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setErrorMsg("Invalid username or password!");
      } else {
        setErrorMsg("An error occurred, please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            width: "100%",
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography
            component="h1"
            variant="h5"
            sx={{ fontWeight: "bold", mb: 2 }}
          >
            Login to System
          </Typography>

          {errorMsg && (
            <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
              {errorMsg}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ mt: 1, width: "100%" }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              autoComplete="username"
              autoFocus
              {...register("username", { required: "Please enter username" })}
              error={!!errors.username}
              helperText={errors.username ? errors.username.message : ""}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              {...register("password", { required: "Please enter password" })}
              error={!!errors.password}
              helperText={errors.password ? errors.password.message : ""}
            />

            <Box sx={{ textAlign: "right", mt: 2 }}>
              <Typography variant="body1">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  style={{
                    textDecoration: "none",
                    color: "#1976d2",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.textDecoration = "underline")
                  }
                  onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
                >
                  Register now
                </Link>
              </Typography>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Login"
              )}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;
