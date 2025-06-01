'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Box, Typography, Paper } from '@mui/material';
import { PieChart, Pie, Cell, Legend } from 'recharts';
import axios from 'axios';

const MACRO_COLORS = ['#FF6384', '#FFCE56', '#36A2EB'];
const MEAL_TYPE_COLORS = ['#4CAF50', '#FFCE56', '#FF6384'];

const CHART_SIZE = 250;
const OUTER_RADIUS = 80;
const LEGEND_HEIGHT = 36;
const CHART_CONTAINER_HEIGHT = CHART_SIZE + LEGEND_HEIGHT + 60;

const renderMacroPieChart = (protein: number, fat: number, carbs: number) => {
  const data = [
    { name: 'Protein', value: protein },
    { name: 'Fat', value: fat },
    { name: 'Carbs', value: carbs },
  ];

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="space-between"
      height={CHART_CONTAINER_HEIGHT}
      minWidth={CHART_SIZE}
      p={1}
    >
      <PieChart width={CHART_SIZE} height={CHART_SIZE}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={40}
          outerRadius={OUTER_RADIUS}
          label
        >
          {data.map((_, index) => (
            <Cell key={`macro-cell-${index}`} fill={MACRO_COLORS[index]} />
          ))}
        </Pie>
        <Legend verticalAlign="bottom" height={LEGEND_HEIGHT} />
      </PieChart>
      <Typography variant="h6" mt={1}>Macronutrients</Typography>
    </Box>
  );
};

const renderMealTypePieChart = (
  vegan: number,
  vegetarian: number,
  meat: number
) => {
  const data = [
    { name: 'Vegan', value: vegan },
    { name: 'Vegetarian', value: vegetarian },
    { name: 'Meat', value: meat },
  ];

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="space-between"
      height={CHART_CONTAINER_HEIGHT}
      minWidth={CHART_SIZE}
      p={1}
    >
      <PieChart width={CHART_SIZE} height={CHART_SIZE}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={40}
          outerRadius={OUTER_RADIUS}
          label
        >
          {data.map((_, index) => (
            <Cell key={`mealtype-cell-${index}`} fill={MEAL_TYPE_COLORS[index]} />
          ))}
        </Pie>
        <Legend verticalAlign="bottom" height={LEGEND_HEIGHT} />
      </PieChart>
      <Typography variant="h6" mt={1}>Meal Types</Typography>
    </Box>
  );
};

export default function Home() {
  const { user, session } = useAuth();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user || !session) return;

      try {
        const response = await axios.get('/api/statistics', {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

    if (typeof window !== 'undefined') {
      fetchStats();
    }
  }, [user, session]);

  if (!stats) return null;

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="flex-start"
      minHeight="100vh"
      p={2}
    >
      <Paper elevation={1} sx={{ padding: 2, width: '100%', display: 'block' }}>
        <Typography variant="h4" gutterBottom align="center" mb={4}>
          Your Nutrition Statistics
        </Typography>

        <Box display="flex" flexDirection="column" alignItems="center" gap={6}>
          {/* Diagramme */}
          {renderMacroPieChart(stats.proteinPercentage, stats.fatPercentage, stats.carbsPercentage)}
          {renderMealTypePieChart(stats.veganPercentage, stats.vegetarianPercentage, stats.meatPercentage)}
        </Box>

        {/* Statistiken */}
        <Box mt={4} display="flex" flexDirection="column" alignItems="center" gap={2}>
          <Typography variant="h6">Total Calories: {stats.totalCalories}</Typography>
          <Typography variant="h6">Total CO2 Savings: {stats.totalCO2Savings} kg</Typography>
          <Typography variant="h6">Average Meal Rating: {stats.averageRating}</Typography>
          <Typography variant="h6">Total Water Intake: {stats.totalWaterIntakes} ml</Typography>
          <Typography variant="h6">Latest Weight: {stats.latestWeight ? stats.latestWeight.weightKg + " kg" : "No data"}</Typography>
        </Box>
      </Paper>
    </Box>
  );
}
