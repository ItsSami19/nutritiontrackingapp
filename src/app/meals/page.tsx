"use client";
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
  CircularProgress,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface Meal {
  id: string;
  title: string;
  calories: number;
  carbohydrates: number;
  fat: number;
  protein: number;
  containsMeat: boolean;
  vegetarian: boolean;
  vegan: boolean;
  imageUrl: string | null;
  rating: number;
  environmentalScore: number;
  co2Savings: number | null;
}

export default function MealsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [openDialogAdd, setOpenDialogAdd] = useState(false);
  const [openDialogEdit, setOpenDialogEdit] = useState(false);
  const [openDialogRemove, setOpenDialogRemove] = useState(false);

  const [newMeal, setNewMeal] = useState<Omit<Meal, "id">>({
    title: "",
    calories: 0,
    carbohydrates: 0,
    fat: 0,
    protein: 0,
    containsMeat: false,
    vegetarian: false,
    vegan: false,
    imageUrl: null,
    rating: 3,
    environmentalScore: 2,
    co2Savings: null,
  });

  const [editMeal, setEditMeal] = useState<Meal | null>(null);
  const [mealToRemove, setMealToRemove] = useState<Meal | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchMeals();
    }
  }, [status, router]);

  const fetchMeals = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/getMeals");

      if (!res.ok) throw new Error("Failed to fetch meals");

      const data = await res.json();
      setMeals(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load meals");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMeal = async () => {
    try {
      const res = await fetch("/api/addMeal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMeal),
      });

      if (!res.ok) throw new Error("Failed to add meal");

      setOpenDialogAdd(false);
      fetchMeals();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add meal");
      console.error(err);
    }
  };

  const handleEditMeal = async () => {
    if (!editMeal) return;

    try {
      const res = await fetch("/api/editMeal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editMeal),
      });

      if (!res.ok) throw new Error("Failed to update meal");

      setOpenDialogEdit(false);
      fetchMeals();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update meal");
      console.error(err);
    }
  };

  const handleRemoveMeal = async () => {
    if (!mealToRemove) return;

    try {
      const res = await fetch("/api/removeMeal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: mealToRemove.id }),
      });

      if (!res.ok) throw new Error("Failed to delete meal");

      setOpenDialogRemove(false);
      fetchMeals();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete meal");
      console.error(err);
    }
  };

  if (status === "loading" || isLoading) {
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

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ padding: 4, width: 1100, mx: "auto" }}>
        <Stack spacing={2}>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h4" fontWeight="bold">
              Meal Library
            </Typography>
            <Button
              variant="contained"
              sx={{ bgcolor: "black", color: "white", height: 56, px: 3 }}
              onClick={() => setOpenDialogAdd(true)}
            >
              Add Meal
            </Button>
          </Box>

          {meals.length === 0 ? (
            <Box
              sx={{
                textAlign: "center",
                py: 8,
                border: "1px dashed #ccc",
                borderRadius: 1,
              }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                No meals available yet
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                Start by adding your first meal
              </Typography>
              <Button
                variant="outlined"
                sx={{
                  borderColor: "black",
                  color: "black",
                  "&:hover": { bgcolor: "#f5f5f5" },
                }}
                onClick={() => setOpenDialogAdd(true)}
              >
                Create First Meal
              </Button>
            </Box>
          ) : (
            meals.map((meal) => (
              <Paper
                key={meal.id}
                elevation={1}
                sx={{ p: 2, width: "100%", display: "flex", mb: 2 }}
              >
                <CardMedia
                  component="img"
                  image={meal.imageUrl || "https://via.placeholder.com/180"}
                  alt={meal.title}
                  sx={{ width: 180, height: 180, objectFit: "cover" }}
                />
                <Box sx={{ flex: 1, pl: 3 }}>
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
                      <Typography variant="h6">
                        {meal.rating}/5 Stars
                      </Typography>
                      <Typography variant="h5" fontWeight="bold">
                        ·
                      </Typography>
                      <Typography variant="h6">
                        🌳-Score:{" "}
                        {meal.environmentalScore === 3
                          ? "High"
                          : meal.environmentalScore === 2
                          ? "Medium"
                          : "Low"}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Button
                        variant="contained"
                        sx={{
                          bgcolor: "black",
                          color: "white",
                          height: 40,
                          width: 90,
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
                          bgcolor: "black",
                          color: "white",
                          height: 40,
                          width: 90,
                        }}
                        onClick={() => {
                          setMealToRemove(meal);
                          setOpenDialogRemove(true);
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
                          <Checkbox checked={meal.containsMeat} disabled />
                        }
                        label={
                          <Typography variant="h6">Contains Meat</Typography>
                        }
                      />
                      <FormControlLabel
                        control={
                          <Checkbox checked={meal.vegetarian} disabled />
                        }
                        label={<Typography variant="h6">Vegetarian</Typography>}
                      />
                      <FormControlLabel
                        control={<Checkbox checked={meal.vegan} disabled />}
                        label={<Typography variant="h6">Vegan</Typography>}
                      />
                    </Box>
                  </Box>
                </Box>
              </Paper>
            ))
          )}
        </Stack>
      </Paper>

      {/* Add Meal Dialog */}
      <Dialog
        open={openDialogAdd}
        onClose={() => setOpenDialogAdd(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Add New Meal</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Title"
              fullWidth
              value={newMeal.title}
              onChange={(e) =>
                setNewMeal({ ...newMeal, title: e.target.value })
              }
            />
            <TextField
              label="Image URL"
              fullWidth
              value={newMeal.imageUrl || ""}
              onChange={(e) =>
                setNewMeal({ ...newMeal, imageUrl: e.target.value || null })
              }
            />
            <TextField
              label="Calories"
              type="number"
              fullWidth
              value={newMeal.calories}
              onChange={(e) =>
                setNewMeal({ ...newMeal, calories: Number(e.target.value) })
              }
            />
            <TextField
              label="Carbohydrates (g)"
              type="number"
              fullWidth
              value={newMeal.carbohydrates}
              onChange={(e) =>
                setNewMeal({
                  ...newMeal,
                  carbohydrates: Number(e.target.value),
                })
              }
            />
            <TextField
              label="Protein (g)"
              type="number"
              fullWidth
              value={newMeal.protein}
              onChange={(e) =>
                setNewMeal({ ...newMeal, protein: Number(e.target.value) })
              }
            />
            <TextField
              label="Fat (g)"
              type="number"
              fullWidth
              value={newMeal.fat}
              onChange={(e) =>
                setNewMeal({ ...newMeal, fat: Number(e.target.value) })
              }
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={newMeal.containsMeat}
                    onChange={(e) =>
                      setNewMeal({ ...newMeal, containsMeat: e.target.checked })
                    }
                  />
                }
                label="Contains Meat"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={newMeal.vegetarian}
                    onChange={(e) =>
                      setNewMeal({ ...newMeal, vegetarian: e.target.checked })
                    }
                  />
                }
                label="Vegetarian"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={newMeal.vegan}
                    onChange={(e) =>
                      setNewMeal({ ...newMeal, vegan: e.target.checked })
                    }
                  />
                }
                label="Vegan"
              />
            </Box>
            <TextField
              label="Rating (1-5)"
              type="number"
              fullWidth
              value={newMeal.rating}
              onChange={(e) =>
                setNewMeal({ ...newMeal, rating: Number(e.target.value) })
              }
              inputProps={{ min: 1, max: 5 }}
            />
            <TextField
              label="Environmental Score (1-3)"
              type="number"
              fullWidth
              value={newMeal.environmentalScore}
              onChange={(e) =>
                setNewMeal({
                  ...newMeal,
                  environmentalScore: Number(e.target.value),
                })
              }
              inputProps={{ min: 1, max: 3 }}
              helperText="1 = Low, 2 = Medium, 3 = High"
            />
            <TextField
              label="CO₂ Savings (g)"
              type="number"
              fullWidth
              value={newMeal.co2Savings || ""}
              onChange={(e) =>
                setNewMeal({
                  ...newMeal,
                  co2Savings: e.target.value ? Number(e.target.value) : null,
                })
              }
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setOpenDialogAdd(false)}
            sx={{ color: "black" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddMeal}
            variant="contained"
            sx={{ bgcolor: "black", color: "white" }}
          >
            Add Meal
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Meal Dialog */}
      {editMeal && (
        <Dialog
          open={openDialogEdit}
          onClose={() => setOpenDialogEdit(false)}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle>Edit Meal</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="Title"
                fullWidth
                value={editMeal.title}
                onChange={(e) =>
                  setEditMeal({ ...editMeal, title: e.target.value })
                }
              />
              <TextField
                label="Image URL"
                fullWidth
                value={editMeal.imageUrl || ""}
                onChange={(e) =>
                  setEditMeal({ ...editMeal, imageUrl: e.target.value || null })
                }
              />
              <TextField
                label="Calories"
                type="number"
                fullWidth
                value={editMeal.calories}
                onChange={(e) =>
                  setEditMeal({ ...editMeal, calories: Number(e.target.value) })
                }
              />
              <TextField
                label="Carbohydrates (g)"
                type="number"
                fullWidth
                value={editMeal.carbohydrates}
                onChange={(e) =>
                  setEditMeal({
                    ...editMeal,
                    carbohydrates: Number(e.target.value),
                  })
                }
              />
              <TextField
                label="Protein (g)"
                type="number"
                fullWidth
                value={editMeal.protein}
                onChange={(e) =>
                  setEditMeal({ ...editMeal, protein: Number(e.target.value) })
                }
              />
              <TextField
                label="Fat (g)"
                type="number"
                fullWidth
                value={editMeal.fat}
                onChange={(e) =>
                  setEditMeal({ ...editMeal, fat: Number(e.target.value) })
                }
              />
              <Box sx={{ display: "flex", gap: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={editMeal.containsMeat}
                      onChange={(e) =>
                        setEditMeal({
                          ...editMeal,
                          containsMeat: e.target.checked,
                        })
                      }
                    />
                  }
                  label="Contains Meat"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={editMeal.vegetarian}
                      onChange={(e) =>
                        setEditMeal({
                          ...editMeal,
                          vegetarian: e.target.checked,
                        })
                      }
                    />
                  }
                  label="Vegetarian"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={editMeal.vegan}
                      onChange={(e) =>
                        setEditMeal({ ...editMeal, vegan: e.target.checked })
                      }
                    />
                  }
                  label="Vegan"
                />
              </Box>
              <TextField
                label="Rating (1-5)"
                type="number"
                fullWidth
                value={editMeal.rating}
                onChange={(e) =>
                  setEditMeal({ ...editMeal, rating: Number(e.target.value) })
                }
                inputProps={{ min: 1, max: 5 }}
              />
              <TextField
                label="Environmental Score (1-3)"
                type="number"
                fullWidth
                value={editMeal.environmentalScore}
                onChange={(e) =>
                  setEditMeal({
                    ...editMeal,
                    environmentalScore: Number(e.target.value),
                  })
                }
                inputProps={{ min: 1, max: 3 }}
                helperText="1 = Low, 2 = Medium, 3 = High"
              />
              <TextField
                label="CO₂ Savings (g)"
                type="number"
                fullWidth
                value={editMeal.co2Savings || ""}
                onChange={(e) =>
                  setEditMeal({
                    ...editMeal,
                    co2Savings: e.target.value ? Number(e.target.value) : null,
                  })
                }
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              onClick={() => setOpenDialogEdit(false)}
              sx={{ color: "black" }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditMeal}
              variant="contained"
              sx={{ bgcolor: "black", color: "white" }}
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Remove Meal Dialog */}
      {mealToRemove && (
        <Dialog
          open={openDialogRemove}
          onClose={() => setOpenDialogRemove(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Confirm Removal</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to remove the meal "{mealToRemove.title}"?
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              onClick={() => setOpenDialogRemove(false)}
              sx={{ color: "black" }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRemoveMeal}
              variant="contained"
              sx={{ bgcolor: "#d32f2f", color: "white" }}
            >
              Remove Meal
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}
