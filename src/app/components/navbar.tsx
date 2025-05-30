"use client";

import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Box,
  Tab,
  Tabs,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const tabPaths = ["/tracking", "/meals", "/statistics"];
  const currentTab = tabPaths.includes(pathname) ? pathname : false;

  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    router.push(newValue);
  };

  const handleNotificationsClick = () => {
    router.push("/notifications");
  };

  const handleLogoutClick = async () => {
    const { error } = await signOut();
    if (error) {
      console.error("Logout failed:", error.message);
      alert("Logout fehlgeschlagen. Schau in die Konsole.");
    } else {
      router.push("/login");
    }
  };

  return (
    <AppBar
      position="static"
      sx={{
        flexDirection: "column",
        alignItems: "stretch",
        backgroundColor: "#000000",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", width: "100%" }}>
        <Typography variant="h6" fontWeight="bold" color="inherit">
          Nutrition Tracker
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            color="inherit"
            aria-label="notifications"
            onClick={handleNotificationsClick}
          >
            <NotificationsIcon />
          </IconButton>
          {user && (
            <Button
              color="inherit"
              variant="outlined"
              startIcon={<LogoutIcon />}
              onClick={handleLogoutClick}
            >
              Logout
            </Button>
          )}
        </Box>
      </Toolbar>

      <Box sx={{ px: 2, pb: 1, alignSelf: "flex-start" }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          textColor="inherit"
          indicatorColor="secondary"
        >
          <Tab label="Tracking" value="/tracking" />
          <Tab label="Meals" value="/meals" />
          <Tab label="Statistics" value="/statistics" />
        </Tabs>
      </Box>
    </AppBar>
  );
}
