"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  useTheme,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";

// Farben für die Diagramme
const MACRO_COLORS = ["#FF6384", "#FFCE56", "#36A2EB"];
const MEAL_TYPE_COLORS = ["#4CAF50", "#FFCE56", "#FF6384"];

interface Statistics {
  proteinPercentage: number;
  fatPercentage: number;
  carbsPercentage: number;
  veganPercentage: number;
  vegetarianPercentage: number;
  meatPercentage: number;
  totalCalories: number;
  totalCO2Savings: number;
  averageRating: number;
  totalWaterIntakes: number;
  latestWeight: number | null;
}

export default function StatisticsPage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<Statistics | null>(null);
  const [timeRange, setTimeRange] = useState<string>("week");
  const theme = useTheme();

  const fetchStatistics = async () => {
    if (status !== "authenticated") return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/statistics?range=${timeRange}`);

      if (!res.ok) {
        throw new Error("Failed to fetch statistics");
      }

      const data = await res.json();
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, [status, timeRange]);

  if (status === "loading") {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (status === "unauthenticated") {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Typography>Please log in to view statistics</Typography>
      </Box>
    );
  }

  // Render-Funktion für das Makronährstoff-Diagramm
  const renderMacroPieChart = () => {
    if (!stats) return null;

    const data = [
      { name: "Protein", value: stats.proteinPercentage },
      { name: "Fat", value: stats.fatPercentage },
      { name: "Carbs", value: stats.carbsPercentage },
    ];

    return (
      <Box display="flex" flexDirection="column" alignItems="center">
        <Typography variant="h6" mb={1}>
          Macronutrients
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
            >
              {data.map((_, index) => (
                <Cell key={`macro-cell-${index}`} fill={MACRO_COLORS[index]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    );
  };

  // Render-Funktion für das Mahlzeitentyp-Diagramm
  const renderMealTypePieChart = () => {
    if (!stats) return null;

    const data = [
      { name: "Vegan", value: stats.veganPercentage },
      { name: "Vegetarian", value: stats.vegetarianPercentage },
      { name: "Meat", value: stats.meatPercentage },
    ];

    return (
      <Box display="flex" flexDirection="column" alignItems="center">
        <Typography variant="h6" mb={1}>
          Meal Types
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
            >
              {data.map((_, index) => (
                <Cell
                  key={`mealtype-cell-${index}`}
                  fill={MEAL_TYPE_COLORS[index]}
                />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    );
  };

  return (
    <Box sx={{ py: 4, minHeight: "100vh" }}>
      <Box display="flex" justifyContent="center">
        <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 1200 }}>
          <Stack spacing={3}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h4" fontWeight="bold">
                Nutrition Statistics
              </Typography>

              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel>Time Range</InputLabel>
                <Select
                  value={timeRange}
                  label="Time Range"
                  onChange={(e) => setTimeRange(e.target.value)}
                >
                  <MenuItem value="day">Today</MenuItem>
                  <MenuItem value="week">This Week</MenuItem>
                  <MenuItem value="month">This Month</MenuItem>
                  <MenuItem value="year">This Year</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {loading ? (
              <Box display="flex" justifyContent="center">
                <CircularProgress size={60} />
              </Box>
            ) : stats ? (
              <>
                <Box
                  display="flex"
                  flexWrap="wrap"
                  gap={4}
                  justifyContent="center"
                >
                  <Box flex={1} minWidth={400} maxWidth={500}>
                    {renderMacroPieChart()}
                  </Box>

                  <Box flex={1} minWidth={400} maxWidth={500}>
                    {renderMealTypePieChart()}
                  </Box>
                </Box>

                <Box
                  display="grid"
                  gridTemplateColumns={{
                    xs: "1fr",
                    sm: "1fr 1fr",
                    md: "repeat(3, 1fr)",
                  }}
                  gap={3}
                  mt={4}
                >
                  <Card variant="outlined" sx={{ height: "100%" }}>
                    <CardContent>
                      <Typography variant="subtitle1" color="text.secondary">
                        Total Calories
                      </Typography>
                      <Typography variant="h3" fontWeight="bold">
                        {stats.totalCalories}
                      </Typography>
                    </CardContent>
                  </Card>

                  <Card variant="outlined" sx={{ height: "100%" }}>
                    <CardContent>
                      <Typography variant="subtitle1" color="text.secondary">
                        CO₂ Savings
                      </Typography>
                      <Typography variant="h3" fontWeight="bold">
                        {stats.totalCO2Savings.toFixed(2)} kg
                      </Typography>
                    </CardContent>
                  </Card>

                  <Card variant="outlined" sx={{ height: "100%" }}>
                    <CardContent>
                      <Typography variant="subtitle1" color="text.secondary">
                        Avg. Meal Rating
                      </Typography>
                      <Typography variant="h3" fontWeight="bold">
                        {stats.averageRating}
                      </Typography>
                    </CardContent>
                  </Card>

                  <Card variant="outlined" sx={{ height: "100%" }}>
                    <CardContent>
                      <Typography variant="subtitle1" color="text.secondary">
                        Protein Intake
                      </Typography>
                      <Typography variant="h3" fontWeight="bold">
                        {stats.proteinPercentage}%
                      </Typography>
                    </CardContent>
                  </Card>

                  <Card variant="outlined" sx={{ height: "100%" }}>
                    <CardContent>
                      <Typography variant="subtitle1" color="text.secondary">
                        Vegan Meals
                      </Typography>
                      <Typography variant="h3" fontWeight="bold">
                        {stats.veganPercentage}%
                      </Typography>
                    </CardContent>
                  </Card>

                  <Card variant="outlined" sx={{ height: "100%" }}>
                    <CardContent>
                      <Typography variant="subtitle1" color="text.secondary">
                        Water Intake
                      </Typography>
                      <Typography variant="h3" fontWeight="bold">
                        {stats.totalWaterIntakes} ml
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              </>
            ) : (
              <Typography color="text.secondary" textAlign="center">
                No statistics available
              </Typography>
            )}
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
}
