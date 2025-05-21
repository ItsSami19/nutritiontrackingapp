'use client';

import { Box, Button, Typography, Paper, Stack } from '@mui/material';

export default function Home() {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Paper elevation={2} sx={{ padding: 4, width: 500 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Your Nutrition Overview
        </Typography>

        <Stack spacing={2} mb={4}>
          <Box display="flex" justifyContent="space-between">
            <Typography>Calories last day/week/month</Typography>
            <Typography>2000kcal / 14000kcal / 56000kcal</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Typography>Avg. Meal Rating</Typography>
            <Typography>Low</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Typography># of Meat-free Meals</Typography>
            <Typography>4</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Typography>CO2-Savings</Typography>
            <Typography>200kg</Typography>
          </Box>
        </Stack>

        <Box display="flex" justifyContent="center">
          <Button variant="contained" style={{backgroundColor: 'black', color: 'white'}}>
            Set Goal
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
