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
  CircularProgress,
  Chip,
  Snackbar,
  Alert,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useSession } from "next-auth/react";
import { format } from "date-fns";

interface Meal {
  id: string;
  title: string;
  calories: number;
  carbohydrates: number;
  protein: number;
  fat: number;
  containsMeat: boolean;
  vegetarian: boolean;
  vegan: boolean;
  imageUrl: string | null;
}

interface TrackedMeal {
  id: string;
  date: string;
  meal: Meal;
}

export default function TrackingPage() {
  const { data: session, status } = useSession();
  const [date, setDate] = useState<Date>(new Date());
  const [trackedMeals, setTrackedMeals] = useState<TrackedMeal[]>([]);
  const [mealPool, setMealPool] = useState<Meal[]>([]);
  const [loading, setLoading] = useState({
    tracked: false,
    pool: false,
    action: false,
  });
  const [openSelectDialog, setOpenSelectDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  // Helper function to handle API errors
  const handleApiError = (error: any, defaultMessage: string) => {
    console.error("API Error:", error);
    let errorMessage = defaultMessage;

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    } else if (error?.message) {
      errorMessage = error.message;
    }

    setError(errorMessage);
    setSnackbar({
      open: true,
      message: errorMessage,
      severity: "error",
    });
  };

  // Fetch tracked meals for the selected date
  const fetchTrackedMeals = async () => {
    if (status !== "authenticated") return;

    setLoading((prev) => ({ ...prev, tracked: true }));
    setError(null);

    try {
      const dateStr = encodeURIComponent(date.toISOString());
      const res = await fetch(`/api/trackedMeal?date=${dateStr}`);

      if (!res.ok) {
        const errorText = await res.text();
        try {
          // Try to parse the error as JSON
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.error || "Failed to fetch tracked meals");
        } catch {
          // If not JSON, use the raw text
          throw new Error(errorText || "Failed to fetch tracked meals");
        }
      }

      const data: TrackedMeal[] = await res.json();
      setTrackedMeals(data);
    } catch (err) {
      handleApiError(err, "Failed to load tracked meals");
    } finally {
      setLoading((prev) => ({ ...prev, tracked: false }));
    }
  };
  const handleAddTrackedMeal = async (mealId: string) => {
    setLoading((prev) => ({ ...prev, action: true }));

    try {
      const res = await fetch("/api/trackedMeal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mealId,
          date: date.toISOString(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to track meal");
      }

      setTrackedMeals((prev) => [...prev, data]);
      setSnackbar({
        open: true,
        message: "Meal tracked successfully!",
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to track meal",
        severity: "error",
      });
    } finally {
      setLoading((prev) => ({ ...prev, action: false }));
      setOpenSelectDialog(false);
    }
  };
  // Fetch available meals to track
  const fetchMealPool = async () => {
    if (status !== "authenticated") return;

    setLoading((prev) => ({ ...prev, pool: true }));
    setError(null);

    try {
      const res = await fetch("/api/getMeals");

      if (!res.ok) {
        const errorText = await res.text();
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.error || "Failed to fetch meal pool");
        } catch {
          throw new Error(errorText || "Failed to fetch meal pool");
        }
      }

      const data: Meal[] = await res.json();
      setMealPool(data);
    } catch (err) {
      handleApiError(err, "Failed to load available meals");
    } finally {
      setLoading((prev) => ({ ...prev, pool: false }));
    }
  };

  // Remove a tracked meal
  const handleRemoveTrackedMeal = async (trackedMealId: string) => {
    if (status !== "authenticated") return;

    setLoading((prev) => ({ ...prev, action: true }));
    setError(null);

    try {
      const res = await fetch("/api/trackedMeal", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: trackedMealId }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.error || "Failed to remove tracked meal");
        } catch {
          throw new Error(errorText || "Failed to remove tracked meal");
        }
      }

      setTrackedMeals((prev) =>
        prev.filter((meal) => meal.id !== trackedMealId)
      );
      setSnackbar({
        open: true,
        message: "Meal removed successfully!",
        severity: "success",
      });
    } catch (err) {
      handleApiError(err, "Failed to remove meal");
    } finally {
      setLoading((prev) => ({ ...prev, action: false }));
    }
  };

  // Load tracked meals when date or auth status changes
  useEffect(() => {
    if (status === "authenticated") {
      fetchTrackedMeals();
    }
  }, [date, status]);

  // Loading state for initial auth check
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

  // Redirect to login if not authenticated
  if (status === "unauthenticated") {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Typography>Please log in to view this page</Typography>
      </Box>
    );
  }

  // Calculate totals for the day
  const totals = trackedMeals.reduce(
    (acc, meal) => {
      return {
        calories: acc.calories + meal.meal.calories,
        protein: acc.protein + meal.meal.protein,
        carbs: acc.carbs + meal.meal.carbohydrates,
        fat: acc.fat + meal.meal.fat,
      };
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return (
    <Box sx={{ py: 4, minHeight: "100vh" }}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box display="flex" justifyContent="center">
          <Paper
            elevation={3}
            sx={{ p: 4, width: "100%", maxWidth: 1000, borderRadius: 2 }}
          >
            <Stack spacing={3}>
              {/* Date picker and add meal button */}
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                flexWrap="wrap"
                gap={2}
              >
                <DatePicker
                  label="Select date"
                  value={date}
                  onChange={(newDate) => newDate && setDate(newDate)}
                  sx={{ width: 250 }}
                />
                <Button
                  variant="contained"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={() => {
                    setOpenSelectDialog(true);
                    if (mealPool.length === 0) fetchMealPool();
                  }}
                  disabled={loading.action}
                >
                  Add Meal
                </Button>
              </Box>

              {/* Page title */}
              <Typography variant="h5" fontWeight="bold">
                Tracked Meals for {format(date, "MMMM d, yyyy")}
              </Typography>

              {/* Totals summary */}
              {trackedMeals.length > 0 && (
                <Box
                  sx={{
                    p: 2,
                    backgroundColor: "background.paper",
                    borderRadius: 1,
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Typography variant="subtitle1" gutterBottom>
                    Daily Totals:
                  </Typography>
                  <Box display="flex" gap={3} flexWrap="wrap">
                    <Typography>
                      <strong>Calories:</strong> {totals.calories} kcal
                    </Typography>
                    <Typography>
                      <strong>Protein:</strong> {totals.protein.toFixed(1)}g
                    </Typography>
                    <Typography>
                      <strong>Carbs:</strong> {totals.carbs.toFixed(1)}g
                    </Typography>
                    <Typography>
                      <strong>Fat:</strong> {totals.fat.toFixed(1)}g
                    </Typography>
                  </Box>
                </Box>
              )}

              {/* Error message */}
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              {/* Loading state for tracked meals */}
              {loading.tracked ? (
                <Box display="flex" justifyContent="center" py={4}>
                  <CircularProgress />
                </Box>
              ) : (
                <>
                  {/* Empty state */}
                  {trackedMeals.length === 0 && (
                    <Typography variant="body1" color="text.secondary">
                      No meals tracked for this date
                    </Typography>
                  )}

                  {/* Tracked meals list */}
                  <Stack spacing={2}>
                    {trackedMeals.map((tracked) => (
                      <Card key={tracked.id} sx={{ display: "flex" }}>
                        <CardMedia
                          component="img"
                          image={
                            tracked.meal.imageUrl || "/food-placeholder.jpg"
                          }
                          alt={tracked.meal.title}
                          sx={{ width: 180, height: 180, objectFit: "cover" }}
                        />
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            flex: 1,
                          }}
                        >
                          <CardContent sx={{ flex: "1 0 auto" }}>
                            <Box
                              display="flex"
                              justifyContent="space-between"
                              alignItems="flex-start"
                            >
                              <Box>
                                <Typography variant="h6" fontWeight="bold">
                                  {tracked.meal.title}
                                </Typography>
                                <Typography variant="body1" sx={{ mt: 1 }}>
                                  {tracked.meal.calories} kcal ·{" "}
                                  {tracked.meal.carbohydrates}g carbs ·{" "}
                                  {tracked.meal.protein}g protein ·{" "}
                                  {tracked.meal.fat}g fat
                                </Typography>
                                <Box
                                  sx={{
                                    mt: 1,
                                    display: "flex",
                                    gap: 1,
                                    flexWrap: "wrap",
                                  }}
                                >
                                  {tracked.meal.vegetarian && (
                                    <Chip
                                      label="Vegetarian"
                                      color="success"
                                      size="small"
                                    />
                                  )}
                                  {tracked.meal.vegan && (
                                    <Chip
                                      label="Vegan"
                                      color="success"
                                      size="small"
                                    />
                                  )}
                                  {tracked.meal.containsMeat && (
                                    <Chip
                                      label="Contains Meat"
                                      color="error"
                                      size="small"
                                    />
                                  )}
                                </Box>
                              </Box>
                              <IconButton
                                onClick={() =>
                                  handleRemoveTrackedMeal(tracked.id)
                                }
                                disabled={loading.action}
                                color="error"
                              >
                                <DeleteOutlineIcon />
                              </IconButton>
                            </Box>
                          </CardContent>
                        </Box>
                      </Card>
                    ))}
                  </Stack>
                </>
              )}
            </Stack>
          </Paper>
        </Box>

        {/* Dialog to select meals to track */}
        <Dialog
          open={openSelectDialog}
          onClose={() => setOpenSelectDialog(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{ sx: { borderRadius: 2 } }}
        >
          <DialogTitle>Select Meal to Track</DialogTitle>
          <DialogContent dividers>
            {loading.pool ? (
              <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress />
              </Box>
            ) : mealPool.length === 0 ? (
              <Typography variant="body1" color="text.secondary">
                No meals available. Create some meals first.
              </Typography>
            ) : (
              <List>
                {mealPool.map((meal) => (
                  <ListItem key={meal.id} divider>
                    <ListItemText
                      primary={meal.title}
                      secondary={`${meal.calories} kcal · ${meal.carbohydrates}g carbs · ${meal.protein}g protein · ${meal.fat}g fat`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={() => handleAddTrackedMeal(meal.id)}
                        disabled={loading.action}
                        color="primary"
                      >
                        <AddCircleOutlineIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenSelectDialog(false)}>Cancel</Button>
          </DialogActions>
        </Dialog>
      </LocalizationProvider>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
