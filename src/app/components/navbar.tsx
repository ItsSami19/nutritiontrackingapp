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
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();

  // Pfade, auf denen die Navbar nicht angezeigt werden soll
  const hiddenPaths = ["/login", "/signup"];
  if (hiddenPaths.includes(pathname)) {
    return null;
  }

  const tabPaths = ["/tracking", "/meals", "/statistics"];
  const currentTab = tabPaths.includes(pathname) ? pathname : false;

  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    router.push(newValue);
  };

  const handleNotificationsClick = () => {
    router.push("/notifications");
  };

  const handleLogoutClick = async () => {
    try {
      await signOut({ redirect: false });
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
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
          {session?.user && (
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

      {session?.user && (
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
      )}
    </AppBar>
  );
}
