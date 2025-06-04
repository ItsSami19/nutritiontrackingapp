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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import React, { useState, useEffect } from 'react';

interface Meals {
  id: string;
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
  const [meals, setMeals] = useState<Meals[]>([])
  const [error, setError] = useState<string | null>(null)
  const [openDialogAdd, setOpenDialogAdd] = useState(false);
  const [openDialogEdit, setOpenDialogEdit] = useState(false);
  const [openDialogRemove, setOpenDialogRemove] = useState(false);

  const [newMeal, setNewMeal] = useState<Partial<Meals>>({
    title: '',
    calories: 0,
    carbohydrates: 0,
    fat: 0,
    protein: 0,
    containsMeat: false,
    vegetarian: false,
    vegan: false,
    imageUrl: '',
    rating: 3,
    environmentalScore: 2,
    co2Savings: 0
  });

  const [editMeal, setEditMeal] = useState<Partial<Meals>>({
    id:'',
    title:'',
    calories: 0,
    carbohydrates: 0,
    fat: 0,
    protein: 0,
    containsMeat: false,
    vegetarian: false,
    vegan: false,
    imageUrl: '',
    rating: 3,
    environmentalScore: 2,
    co2Savings: 0,
  });

  const [removedMeal, setRemoveMeal] = useState<Partial<Meals>>({
    id:'',
  })

  const handleAdd = async () => {
    try {
      const res = await fetch('/api/addMeal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMeal),
      });

      if (!res.ok) throw new Error('Error while adding meal');
      setOpenDialogAdd(false);
    } catch (err) {
      console.error(err);
      alert('Error while adding meal');
    }
  };

  const handleEdit = async () => {
    try {
      const res = await fetch('/api/editMeal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editMeal),
      });

      if (!res.ok) throw new Error('Error while editing meal');
      setOpenDialogEdit(false);
    } catch (err) {
      console.error(err);
      alert('Error while editing meal');
    }
  }

  const handleRemove = async () => {
    try {
      const res = await fetch('/api/removeMeal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(removedMeal),
      });

      if (!res.ok) throw new Error('Error while removing meal');
      setOpenDialogRemove(false);
    } catch (err) {
      console.error(err);
      alert('Error while removing meal');
    }
  }

  useEffect(() => {
    const fetchData = async() => {
      try {
        const res = await fetch('/api/getMeals');
        if(!res.ok) throw new Error('Not authorized or error fetching data');

        const data = await res.json();

        setMeals(data);
      } catch (err: any) {
        console.error(err);
        setError('Error loading data');
      }
    };
    fetchData();
  }, []);
  if (error) {
    return <Typography color="error">{error}</Typography>;
  }
  if(meals.length === 0 && !error) {
    return <Typography>Loading...</Typography>
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
              onClick={() => setOpenDialogAdd(true)}
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
              <Box sx={{ display: "flex", flexDirection: "column", flex: 1, pl: 3 }}>
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
                    <Typography variant="h5" fontWeight="bold">·</Typography>
                    <Typography variant="h6">{meal.rating}/5 Stars</Typography>
                    <Typography variant="h5" fontWeight="bold">·</Typography>
                    <Typography variant="h6">🌳-Score: {meal.environmentalScore == 3 ? "High" : meal.environmentalScore == 2 ? "Medium" : "Low"}</Typography>
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
                      onClick={() => {
                        setEditMeal(meal);
                        setOpenDialogEdit(true);
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
                      onClick={() => {
                        setRemoveMeal(meal);
                        setOpenDialogRemove(true); 
                      }}
                    >
                      Remove
                    </Button>
                  </Box>
                </Box>
                <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
                  <Box>
                    <Typography variant="h6">{meal.calories} kcal</Typography>
                    <Typography variant="h6">{meal.carbohydrates}g Carbohydrates</Typography>
                    <Typography variant="h6">{meal.protein}g Protein</Typography>
                    <Typography variant="h6">{meal.fat}g Fat</Typography>
                  </Box>
                  <Box sx={{ display: "flex", flexDirection: "column", pl: 5, pr: 17 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={meal.containsMeat}
                          size="small"
                          sx={{ color: "black", "&.Mui-checked": { color: "black" } }}
                        />
                      }
                      label={<Typography variant="h6">Contains Meat</Typography>}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={meal.vegetarian}
                          size="small"
                          sx={{ color: "black", "&.Mui-checked": { color: "black" } }}
                        />
                      }
                      label={<Typography variant="h6">Vegetarian</Typography>}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={meal.vegan}
                          size="small"
                          sx={{ color: "black", "&.Mui-checked": { color: "black" } }}
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
      <Dialog open={openDialogAdd} onClose={() => setOpenDialogAdd(false)} fullWidth maxWidth="md">
          <DialogTitle>Remove Meal</DialogTitle>
            <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField label="Titel" fullWidth value={newMeal.title} onChange={(e) => setNewMeal({ ...newMeal, title: e.target.value })} />
              <TextField label="Bild-URL" fullWidth value={newMeal.imageUrl} onChange={(e) => setNewMeal({ ...newMeal, imageUrl: e.target.value })} />
              <TextField label="Kalorien" type="number" fullWidth value={newMeal.calories} onChange={(e) => setNewMeal({ ...newMeal, calories: Number(e.target.value) })} />
              <TextField label="Kohlenhydrate" type="number" fullWidth value={newMeal.carbohydrates} onChange={(e) => setNewMeal({ ...newMeal, carbohydrates: Number(e.target.value) })} />
              <TextField label="Protein" type="number" fullWidth value={newMeal.protein} onChange={(e) => setNewMeal({ ...newMeal, protein: Number(e.target.value) })} />
              <TextField label="Fett" type="number" fullWidth value={newMeal.fat} onChange={(e) => setNewMeal({ ...newMeal, fat: Number(e.target.value) })} />
              <TextField label="Bewertung (1-5)" type="number" fullWidth value={newMeal.rating} onChange={(e) => setNewMeal({ ...newMeal, rating: Number(e.target.value) })} />
              <TextField label="CO2-Ersparnis (g)" type="number" fullWidth value={newMeal.co2Savings} onChange={(e) => setNewMeal({ ...newMeal, co2Savings: Number(e.target.value) })} />
            </Stack>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button onClick={() => setOpenDialogAdd(false)} sx={{ backgroundColor: "black", color: "white" }}>Cancel</Button>
              <Button onClick={handleAdd} variant="contained" sx={{ backgroundColor: "black", color: "white" }}>Save</Button>
            </DialogActions>
      </Dialog>
      <Dialog open={openDialogEdit} onClose={() => setOpenDialogEdit(false)} fullWidth maxWidth="md">
          <DialogTitle>Edit Meal</DialogTitle>
            <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField label="Title" fullWidth value={editMeal.title} onChange={(e) => setEditMeal({ ...editMeal, title: e.target.value })} />
              <TextField label="Image-URL" fullWidth value={editMeal.imageUrl} onChange={(e) => setEditMeal({ ...editMeal, imageUrl: e.target.value })} />
              <TextField label="Calories" type="number" fullWidth value={editMeal.calories} onChange={(e) => setEditMeal({ ...editMeal, calories: Number(e.target.value) })} />
              <TextField label="Carbohydrates" type="number" fullWidth value={editMeal.carbohydrates} onChange={(e) => setEditMeal({ ...editMeal, carbohydrates: Number(e.target.value) })} />
              <TextField label="Protein" type="number" fullWidth value={editMeal.protein} onChange={(e) => setEditMeal({ ...editMeal, protein: Number(e.target.value) })} />
              <TextField label="Fat" type="number" fullWidth value={editMeal.fat} onChange={(e) => setEditMeal({ ...editMeal, fat: Number(e.target.value) })} />
              <TextField label="Rating (1-5)" type="number" fullWidth value={editMeal.rating} onChange={(e) => setEditMeal({ ...editMeal, rating: Number(e.target.value) })} />
              <TextField label="Co2Savings (g)" type="number" fullWidth value={editMeal.co2Savings} onChange={(e) => setEditMeal({ ...editMeal, co2Savings: Number(e.target.value) })} />
            </Stack>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button onClick={() => setOpenDialogEdit(false)} sx={{ backgroundColor: "black", color: "white" }}>Cancel</Button>
              <Button onClick={handleEdit} variant="contained" sx={{ backgroundColor: "black", color: "white" }}>Save</Button>
            </DialogActions>
      </Dialog>
      <Dialog open={openDialogRemove} onClose={() => setOpenDialogRemove(false)} fullWidth maxWidth="md">
          <DialogTitle>Remove Meal</DialogTitle>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button onClick={() => setOpenDialogRemove(false)} sx={{ backgroundColor: "black", color: "white" }}>No</Button>
              <Button onClick={handleRemove} variant="contained" sx={{ backgroundColor: "black", color: "white" }}>Yes</Button>
            </DialogActions>
      </Dialog>
    </Box>
  );
}
