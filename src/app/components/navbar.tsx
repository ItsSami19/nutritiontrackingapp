'use client';

import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Box,
  Tab,
  Tabs,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const tabPaths = ['/tracking', '/meals', '/statistics'];
  const currentTab = tabPaths.includes(pathname) ? pathname : false;

  const handleTabChange = (_: any, newValue: string) => {
    router.push(newValue);
  };

  const handleNotificationsClick = () => {
    router.push('/notifications'); // Beispielseite für Benachrichtigungen
  };

  const handleLogoutClick = () => {
    // Hier ggf. Auth-Daten löschen (localStorage, Cookies etc.)
    router.push('/login'); // Zur Login-Seite navigieren
  };

  return (
    <AppBar
      position="static"
      sx={{
        flexDirection: 'column',
        alignItems: 'stretch',
        backgroundColor: '#000000', // schwarz
      }}
    >
      {/* Oberer Bereich mit Titel und Buttons */}
      <Toolbar sx={{ justifyContent: 'space-between', width: '100%' }}>
        <Typography variant="h6" fontWeight="bold" color="inherit">
          Nutrition Tracker
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            color="inherit"
            aria-label="notifications"
            onClick={handleNotificationsClick}
          >
            <NotificationsIcon />
          </IconButton>
          <Button
            color="inherit"
            variant="outlined"
            startIcon={<LogoutIcon />}
            onClick={handleLogoutClick}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>

      {/* Tabs unterhalb linksbündig */}
      <Box sx={{ px: 2, pb: 1, alignSelf: 'flex-start' }}>
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
