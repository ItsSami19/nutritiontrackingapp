'use client';

import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Box,
  Tabs,
  Tab,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import { useState } from 'react';

export default function Navbar() {
  const [tabValue, setTabValue] = useState(0);

  const handleChange = (_: any, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <AppBar
      position="static"
      sx={{ 
        flexDirection: 'column', 
        alignItems: 'stretch', 
        backgroundColor: '#000000'  // Schwarz
      }}
    >
      {/* Obere Toolbar mit Titel und Buttons */}
      <Toolbar sx={{ justifyContent: 'space-between', width: '100%' }}>
        <Typography variant="h6" fontWeight="bold" color="inherit">
          Nutrition Tracker
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton color="inherit" aria-label="notifications">
            <NotificationsIcon />
          </IconButton>
          <Button
            color="inherit"
            variant="outlined"
            startIcon={<LogoutIcon />}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>

      {/* Untere Tabs, linksbündig */}
      <Box sx={{ px: 2, alignSelf: 'flex-start' }}>
        <Tabs
          value={tabValue}
          onChange={handleChange}
          textColor="inherit"
          indicatorColor="secondary"
          sx={{ minHeight: 36 }}
        >
          <Tab label="Tracking" />
          <Tab label="Meals" />
          <Tab label="Statistics" />
        </Tabs>
      </Box>
    </AppBar>
  );
}
