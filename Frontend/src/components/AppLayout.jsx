import { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse,
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Divider,
  Chip,
  Paper,
} from "@mui/material";
import {
  ExpandLess,
  ExpandMore,
  Menu as MenuIcon,
  Close as CloseIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  RateReview as RateReviewIcon,
  Dashboard as DashboardIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  Group as GroupIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";


const drawerWidth = 280;

// Menu configuration with role-based access
const allMenuItems = [
  {
    label: "Dashboard",
    icon: <DashboardIcon />,
    path: "/dashboard",
    roles: [
      "ADMIN",
      "ROLE_ADMIN",
      "MENTOR",
      "ROLE_MENTOR",
      "STUDENT",
      "ROLE_STUDENT",
    ],
  },
  {
    label: "My Mentor",
    icon: <PersonIcon />,
    path: "/my-mentor",
    roles: ["STUDENT", "ROLE_STUDENT"],
  },
  {
    label: "My Students",
    icon: <GroupIcon />,
    path: "/my-students",
    roles: ["MENTOR", "ROLE_MENTOR"],
  },
  {
    label: "User Management",
    icon: <PeopleIcon />,
    roles: ["ADMIN", "ROLE_ADMIN"],
    children: [
      { label: "All Users", path: "/management/users" },
      { label: "All Students", path: "/management/students" },
      { label: "All Mentors", path: "/management/mentors" },
    ],
  },
  {
    label: "Internship Management",
    icon: <SchoolIcon />,
    roles: ["ADMIN", "ROLE_ADMIN", "MENTOR", "ROLE_MENTOR", "STUDENT", "ROLE_STUDENT"],
    children: [
      { label: "Internship Phases", path: "/management/phases" },
      { label: "Internship Assignments", path: "/management/assignments" },
    ],
  },
  {
    label: "Assessment Management",
    icon: <RateReviewIcon />,
    roles: ["ADMIN", "ROLE_ADMIN", "MENTOR", "ROLE_MENTOR", "STUDENT", "ROLE_STUDENT"],
    children: [
      { label: "Evaluation Criteria", path: "/management/evaluation-criteria" },
      { label: "Assessment Rounds", path: "/management/assessment-rounds" },
      { label: "Assessment Results", path: "/management/assessment-results" },
    ],
  },
];

export const AppLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);

  // Filter menu based on user role
  const getFilteredMenuItems = () => {
    if (!user) return [];
    const userRole = user?.role;
    return allMenuItems.filter((item) => item.roles.includes(userRole));
  };

  const filteredMenuItems = getFilteredMenuItems();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuToggle = (index) => {
    setExpandedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleNavigate = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  const isActive = (path) => location.pathname === path;

  const getRoleColor = (role) => {
    switch (role) {
      case "ADMIN":
      case "ROLE_ADMIN":
        return "#d32f2f";
      case "MENTOR":
      case "ROLE_MENTOR":
        return "#1976d2";
      case "STUDENT":
      case "ROLE_STUDENT":
        return "#388e3c";
      default:
        return "#666";
    }
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const DrawerContent = () => (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <Box
        sx={{
          p: 2.5,
          background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
          color: "white",
          borderBottom: "2px solid rgba(255,255,255,0.1)",
        }}
      >
        <Typography
          variant="h6"
          component="div"
          sx={{ fontWeight: "700", mb: 1 }}
        >
          📚 Internship System
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.9 }}>
          Internship Management System
        </Typography>
      </Box>

      {/* Menu Items */}
      <List sx={{ flex: 1, overflow: "auto", py: 1 }}>
        {filteredMenuItems.map((item, index) => (
          <Box key={index}>
            {item.children ? (
              <>
                <ListItem
                  component="div"
                  onClick={() => handleMenuToggle(index)}
                  sx={{
                    cursor: "pointer",
                    mx: 1,
                    borderRadius: "8px",
                    mb: 0.5,
                    backgroundColor: expandedItems[index]
                      ? "rgba(25, 118, 210, 0.08)"
                      : "transparent",
                    "&:hover": {
                      backgroundColor: "rgba(25, 118, 210, 0.08)",
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: "#1976d2", minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                  {expandedItems[index] ? (
                    <ExpandLess sx={{ color: "#1976d2" }} />
                  ) : (
                    <ExpandMore sx={{ color: "#999" }} />
                  )}
                </ListItem>
                <Collapse in={expandedItems[index]} timeout="auto">
                  <List component="div" disablePadding>
                    {item.children.map((child, childIndex) => (
                      <ListItem
                        component="div"
                        key={childIndex}
                        onClick={() => handleNavigate(child.path)}
                        sx={{
                          cursor: "pointer",
                          pl: 5,
                          py: 1,
                          mx: 1,
                          borderRadius: "6px",
                          mb: 0.3,
                          backgroundColor: isActive(child.path)
                            ? "rgba(25, 118, 210, 0.12)"
                            : "transparent",
                          borderLeft: isActive(child.path)
                            ? "3px solid #1976d2"
                            : "none",
                          "&:hover": {
                            backgroundColor: "rgba(25, 118, 210, 0.08)",
                          },
                        }}
                      >
                        <ListItemText primary={child.label} />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </>
            ) : (
              <ListItem
                component="div"
                onClick={() => handleNavigate(item.path)}
                sx={{
                  cursor: "pointer",
                  mx: 1,
                  borderRadius: "8px",
                  mb: 0.5,
                  backgroundColor: isActive(item.path)
                    ? "rgba(25, 118, 210, 0.12)"
                    : "transparent",
                  borderLeft: isActive(item.path)
                    ? "3px solid #1976d2"
                    : "none",
                  "&:hover": {
                    backgroundColor: "rgba(25, 118, 210, 0.08)",
                  },
                }}
              >
                <ListItemIcon sx={{ color: "#1976d2", minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>
            )}
          </Box>
        ))}
      </List>

      <Divider sx={{ my: 1 }} />

      {/* User Info & Logout */}
      <Box
        sx={{
          p: 2,
          background:
            "linear-gradient(135deg, rgba(25, 118, 210, 0.05), rgba(25, 118, 210, 0.02))",
          borderTop: "1px solid #eee",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 1.5,
            mb: 2,
            background: "white",
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
          }}
        >
          <Typography
            variant="caption"
            sx={{ display: "block", mb: 0.5, color: "#999" }}
          >
            User
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontWeight: "600", mb: 1, color: "#333" }}
          >
            {user?.fullName || user?.username}
          </Typography>
          <Chip
            label={
              user?.role === "ADMIN" || user?.role === "ROLE_ADMIN"
                ? "Administrator"
                : user?.role === "MENTOR" || user?.role === "ROLE_MENTOR"
                  ? "Mentor"
                  : "Student"
            }
            size="small"
            sx={{
              backgroundColor: getRoleColor(user?.role),
              color: "white",
              fontWeight: "600",
            }}
          />
        </Paper>

        <ListItem
          component="div"
          onClick={handleLogout}
          sx={{
            cursor: "pointer",
            borderRadius: "8px",
            backgroundColor: "rgba(211, 47, 47, 0.05)",
            color: "#d32f2f",
            "&:hover": {
              backgroundColor: "rgba(211, 47, 47, 0.1)",
            },
          }}
        >
          <ListItemIcon sx={{ color: "#d32f2f", minWidth: 40 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f7fa" }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontWeight: "700" }}
          >
            Internship Management System
          </Typography>
          <IconButton color="inherit" size="small">
            <SettingsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
        }}
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          <DrawerContent />
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              boxShadow: "2px 0 4px rgba(0,0,0,0.05)",
            },
          }}
          open
        >
          <DrawerContent />
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: "#f5f7fa",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
