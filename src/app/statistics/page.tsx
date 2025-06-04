'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Box, Typography, Card, CardContent } from '@mui/material';
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
      <Typography variant="h6" mb={1} align="center">Macronutrients</Typography>
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
    </Box>
  );
};

const renderMealTypePieChart = (vegan: number, vegetarian: number, meat: number) => {
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
      <Typography variant="h6" mb={1} align="center">Meal Types</Typography> {/* Überschrift oben */}
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
    </Box>
  );
};

export default function Home() {
  const { user, session } = useAuth();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/statistics');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

    fetchStats();
  }, []);


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
      flexDirection={{ xs: 'column', sm: 'row' }}
      justifyContent="center"
      alignItems="flex-start"
      gap={4}
      flexWrap="wrap"
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={6}
        minWidth={{ xs: 'auto', sm: CHART_SIZE + 32 }}
        flex={1}
      >
        {renderMacroPieChart(stats.proteinPercentage, stats.fatPercentage, stats.carbsPercentage)}
        {renderMealTypePieChart(stats.veganPercentage, stats.vegetarianPercentage, stats.meatPercentage)}
      </Box>

      <Box
        display="grid"
        gridTemplateColumns={{ xs: '1fr', sm: '1fr' }}
        gap={3}
        minWidth={{ xs: 'auto', sm: 300 }}
        flex={1}
      >
        <Card variant="outlined">
          <CardContent>
            <Typography variant="subtitle1">Total Calories</Typography>
            <Typography variant="h6">{stats.totalCalories}</Typography>
          </CardContent>
        </Card>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="subtitle1">CO₂ Savings</Typography>
            <Typography variant="h6">{stats.totalCO2Savings} kg</Typography>
          </CardContent>
        </Card>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="subtitle1">Avg. Meal Rating</Typography>
            <Typography variant="h6">{stats.averageRating}</Typography>
          </CardContent>
        </Card>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="subtitle1">Water Intake</Typography>
            <Typography variant="h6">{stats.totalWaterIntakes} ml</Typography>
          </CardContent>
        </Card>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="subtitle1">Latest Weight</Typography>
            <Typography variant="h6">
              {stats.latestWeight ? `${stats.latestWeight.weightKg} kg` : 'No data'}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
