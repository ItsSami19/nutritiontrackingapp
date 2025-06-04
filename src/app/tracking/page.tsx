"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Stack,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { getAccessToken } from "@/lib/user";

interface MealTemplate {
  id: string;
  title: string;
  calories: number;
  carbohydrates: number;
  protein: number;
  fat: number;
  containsMeat: boolean;
  vegetarian: boolean;
  vegan: boolean;
}

interface TrackedMeal {
  id: string;
  date: string;
  meal: MealTemplate;
}

export default function Page() {
  const [date, setDate] = useState<Date | null>(null);
  const [trackedMeals, setTrackedMeals] = useState<TrackedMeal[]>([]);
  const [mealPool, setMealPool] = useState<MealTemplate[]>([]);
  const [loadingPool, setLoadingPool] = useState(false);
  const [openSelectDialog, setOpenSelectDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Beim Mounten auf heute setzen
  useEffect(() => {
    setDate(new Date());
  }, []);

  // 2. Tracked Meals für den gewählten Tag laden
  const fetchTrackedMeals = async () => {
    if (!date) return;
    const token = await getAccessToken();
    if (!token) {
      setError("Nicht eingeloggt.");
      return;
    }

    try {
      const iso = date.toISOString();
      const res = await fetch(`/api/trackedMeal?date=${iso}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Fehler beim Laden der getrackten Meals");
      const data: TrackedMeal[] = await res.json();
      setTrackedMeals(data);
    } catch {
      setError("Fehler beim Laden getrackter Meals.");
    }
  };

  useEffect(() => {
    fetchTrackedMeals();
  }, [date]);

  // 3. Meal-Pool einmalig laden, wenn Dialog geöffnet wird
  const openMealPool = async () => {
    setOpenSelectDialog(true);
    if (mealPool.length > 0) return;
    setLoadingPool(true);

    const token = await getAccessToken();
    if (!token) {
      setError("Nicht eingeloggt.");
      setLoadingPool(false);
      return;
    }

    try {
      const res = await fetch("/api/meals", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Fehler beim Laden der Meals");
      const data: MealTemplate[] = await res.json();
      setMealPool(data);
    } catch {
      setError("Fehler beim Laden der Meal-Vorlagen.");
    } finally {
      setLoadingPool(false);
    }
  };

  // 4. Neues getracktes Meal anlegen
  const handleAddTrackedMeal = async (mealId: string) => {
    if (!date) return;
    const token = await getAccessToken();
    if (!token) {
      setError("Nicht eingeloggt.");
      return;
    }

    try {
      const payload = { mealId, date: date.toISOString() };
      const res = await fetch("/api/trackedMeal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Fehler beim Tracken");
      const created: TrackedMeal = await res.json();
      setTrackedMeals((prev) => [...prev, created]);
    } catch {
      setError("Fehler beim Hinzufügen getrackter Mahlzeit.");
    }
  };

  // 5. Ein getracktes Meal entfernen
  const handleRemoveTracked = async (trackedId: string) => {
    const token = await getAccessToken();
    if (!token) {
      setError("Nicht eingeloggt.");
      return;
    }

    try {
      const res = await fetch("/api/trackedMeal", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: trackedId }),
      });
      if (!res.ok) throw new Error("Fehler beim Entfernen");
      setTrackedMeals((prev) => prev.filter((t) => t.id !== trackedId));
    } catch {
      setError("Fehler beim Entfernen getrackter Mahlzeit.");
    }
  };

  if (!date) return null;

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="flex-start"
      sx={{ py: 4, backgroundColor: "#f7f7f7", minHeight: "100vh" }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          width: 1000,
          borderRadius: 2,
        }}
      >
        <Stack spacing={3}>
          {/* Datumsauswahl + Button zum Öffnen des Meal-Pools */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Datum auswählen"
                value={date}
                onChange={(newDate) => setDate(newDate)}
                slotProps={{
                  textField: {
                    sx: { mb: 0 },
                  },
                }}
              />
            </LocalizationProvider>

            <Button
              variant="contained"
              startIcon={<AddCircleOutlineIcon />}
              sx={{
                backgroundColor: "#1976d2",
                color: "white",
                "&:hover": { backgroundColor: "#115293" },
              }}
              onClick={openMealPool}
            >
              Meal hinzufügen
            </Button>
          </Box>

          {/* Überschrift + Fehlermeldung */}
          <Typography variant="h5" fontWeight="bold">
            Getrackte Mahlzeiten am{" "}
            {date.toLocaleDateString("de-DE", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </Typography>
          {error && <Typography color="error">{error}</Typography>}

          {/* Liste der getrackten Meals */}
          <Stack spacing={2}>
            {trackedMeals.length === 0 && (
              <Typography variant="body1" color="text.secondary">
                Für dieses Datum sind noch keine Mahlzeiten getrackt.
              </Typography>
            )}

            {trackedMeals.map((tracked) => (
              <Card key={tracked.id} sx={{ display: "flex", borderRadius: 2 }}>
                <CardMedia
                  component="img"
                  image="https://source.unsplash.com/featured/?food"
                  alt="Meal"
                  sx={{ width: 180, height: 180 }}
                />
                <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
                  <CardContent sx={{ flex: "1 0 auto" }}>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography
                        component="div"
                        variant="h6"
                        fontWeight="bold"
                      >
                        {tracked.meal.title}
                      </Typography>
                      <IconButton
                        onClick={() => handleRemoveTracked(tracked.id)}
                        sx={{ color: "#d32f2f" }}
                      >
                        <DeleteOutlineIcon />
                      </IconButton>
                    </Box>
                    <Typography
                      variant="subtitle1"
                      color="text.secondary"
                      component="div"
                      sx={{ mt: 1 }}
                    >
                      {tracked.meal.calories} kcal ·{" "}
                      {tracked.meal.carbohydrates}g KH · {tracked.meal.protein}g
                      Protein · {tracked.meal.fat}g Fett
                    </Typography>
                  </CardContent>
                </Box>
              </Card>
            ))}
          </Stack>
        </Stack>
      </Paper>

      {/* Dialog: Existing Meals aus Pool auswählen */}
      <Dialog
        open={openSelectDialog}
        onClose={() => setOpenSelectDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Meal aus Vorlagen auswählen</DialogTitle>
        <DialogContent dividers>
          {loadingPool ? (
            <Typography>Loading...</Typography>
          ) : (
            <List>
              {mealPool.map((m) => (
                <ListItem key={m.id} divider>
                  <ListItemText
                    primary={m.title}
                    secondary={`${m.calories} kcal · ${m.carbohydrates}g KH · ${m.protein}g Protein · ${m.fat}g Fett`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => handleAddTrackedMeal(m.id)}
                      sx={{ color: "#388e3c" }}
                    >
                      <AddCircleOutlineIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
              {mealPool.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  Keine Meal-Vorlagen gefunden.
                </Typography>
              )}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSelectDialog(false)}>Abbrechen</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
