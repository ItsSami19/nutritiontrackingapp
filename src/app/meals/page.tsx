"use client";
//import * as React from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Stack,
  CardMedia,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import React, { useState, useEffect } from "react";

interface Meals {
  title: string;
  calories: number;
  carbohydrates: number;
  fat: number;
  protein: number;
  containsMeat: boolean;
  vegetarian: boolean;
  vegan: boolean;
  imageUrl: string;
  rating: number;
  environmentalScore: number;
  co2Savings: number;
}

export default function Page() {
  const [meals, setMeals] = useState<Meals[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/getMeals");
        if (!res.ok) throw new Error("Not authorized or error fetching data");

        const data = await res.json();

        setMeals(data);
      } catch {
        console.error();
        setError("Error loading data");
      }
    };
    fetchData();
  }, []);
  if (error) {
    return <Typography color="error">{error}</Typography>;
  }
  if (meals.length === 0 && !error) {
    return <Typography>NO MEALS YET!!</Typography>;
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="20vh"
    >
      <Paper elevation={2} sx={{ padding: 4, width: 1100 }}>
        <Stack
          spacing={2}
          sx={{ justifyContent: "flex-start", alignItems: "stretch" }}
        >
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h4" fontWeight="bold">
              Meal Library
            </Typography>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "black",
                color: "white",
                height: "56px",
                px: 3,
              }}
            >
              Add Meal
            </Button>
          </Box>

          {
            // Meal Card
          }

          {meals.map((meal) => (
            <Paper
              key={meal.title}
              elevation={1}
              sx={{ padding: 2, width: "100%", display: "flex" }}
            >
              <CardMedia
                component="img"
                image={meal.imageUrl}
                alt={meal.title}
                sx={{ width: 180, height: 180 }}
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                  pl: 3,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="h5" fontWeight="bold">
                      {meal.title}
                    </Typography>
                    <Typography variant="h5" fontWeight="bold">
                      ·
                    </Typography>
                    <Typography variant="h6">{meal.rating}/5 Stars</Typography>
                    <Typography variant="h5" fontWeight="bold">
                      ·
                    </Typography>
                    <Typography variant="h6">
                      🌳-Score:{" "}
                      {meal.environmentalScore == 3
                        ? "High"
                        : meal.environmentalScore == 2
                        ? "Medium"
                        : "Low"}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "black",
                        color: "white",
                        height: "40px",
                        width: "90px",
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "black",
                        color: "white",
                        height: "40px",
                        width: "90px",
                      }}
                    >
                      Remove
                    </Button>
                  </Box>
                </Box>
                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography variant="h6">{meal.calories} kcal</Typography>
                    <Typography variant="h6">
                      {meal.carbohydrates}g Carbohydrates
                    </Typography>
                    <Typography variant="h6">
                      {meal.protein}g Protein
                    </Typography>
                    <Typography variant="h6">{meal.fat}g Fat</Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      pl: 5,
                      pr: 17,
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={meal.containsMeat}
                          size="small"
                          sx={{
                            color: "black",
                            "&.Mui-checked": { color: "black" },
                          }}
                        />
                      }
                      label={
                        <Typography variant="h6">Contains Meat</Typography>
                      }
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={meal.vegetarian}
                          size="small"
                          sx={{
                            color: "black",
                            "&.Mui-checked": { color: "black" },
                          }}
                        />
                      }
                      label={<Typography variant="h6">Vegetarian</Typography>}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={meal.vegan}
                          size="small"
                          sx={{
                            color: "black",
                            "&.Mui-checked": { color: "black" },
                          }}
                        />
                      }
                      label={<Typography variant="h6">Vegan</Typography>}
                    />
                  </Box>
                </Box>
              </Box>
            </Paper>
          ))}
        </Stack>
      </Paper>
    </Box>
  );
}
