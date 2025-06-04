'use client';

import { useEffect, useState } from "react";
import { Box, Button, Typography, Paper, Stack, TextField, CardMedia, Checkbox, FormControlLabel, Dialog, DialogTitle, DialogContent, DialogActions, FormGroup } from '@mui/material';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { getAccessToken } from "@/lib/user";


export default function Home() {
    const [date, setDate] = useState<Date | null>(null);
    const [meals, setMeals] = useState<any[]>([]);

    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [newMealTitle, setNewMealTitle] = useState("");
    const [newMealCalories, setNewMealCalories] = useState<number | "">("");
    const [newMealCarbohydrates, setNewMealCarbohydrates] = useState<number | "">("");
    const [newMealProtein, setNewMealProtein] = useState<number | "">("");
    const [newMealFat, setNewMealFat] = useState<number | "">("");
    const [newMealType, setNewMealType] = useState<'meat' | 'vegetarian' | 'vegan'>('meat');

    useEffect(() => {
        setDate(new Date());
    }, []);

    const fetchMeals = async () => {
        if (!date) return;

        const token = await getAccessToken();
        if (!token) {
            return;
        }

        const res = await fetch(`/api/tracking?date=${date.toISOString()}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (res.ok) {
            const data = await res.json();
            setMeals(data);
        }
    };

    useEffect(() => {
        fetchMeals();
    }, [date]);

    const handleRemove = async (id: string) => {
        const token = await getAccessToken();
        if (!token) {
            return;
        }

        const res = await fetch('/api/tracking', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ id }),
        });

        if (res.ok) {
            setMeals(prev => prev.filter(m => m.id !== id));
        }
    };

    const handleAddMealClick = () => {
        setNewMealTitle("");
        setNewMealCalories("");
        setNewMealCarbohydrates("");
        setNewMealProtein("");
        setNewMealFat("");
        setNewMealType('meat');
        setOpenAddDialog(true);
    };

    const handleSaveMeal = async () => {
        if (
            !newMealTitle ||
            newMealCalories === "" ||
            newMealCarbohydrates === "" ||
            newMealProtein === "" ||
            newMealFat === ""
        ) {
            alert("Bitte alle Felder ausfüllen.");
            return;
        }

        const token = await getAccessToken();
        if (!token) {
            return;
        }

        const payload = {
            title: newMealTitle,
            calories: newMealCalories,
            carbohydrates: newMealCarbohydrates,
            protein: newMealProtein,
            fat: newMealFat,
            containsMeat: newMealType === 'meat',
            date: date?.toISOString(),
        };

        const res = await fetch('/api/tracking', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });

        if (res.ok) {
            const json = await res.json();
            setMeals(prev => [...prev, json]);
        }

        setOpenAddDialog(false);
    };

    if (!date) {
        return null;
    }

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="20vh">
            <Paper elevation={2} sx={{ padding: 4, width: 1100 }}>
                <Stack spacing={2} sx={{ justifyContent: "flex-start", alignItems: "stretch" }}>
                    <Box display="flex" justifyContent="space-between">
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label="Date"
                                value={date}
                                onChange={(newDate) => setDate(newDate)}
                                slotProps={{
                                    textField: {
                                        fullWidth: false,
                                        sx: { mb: 2 }
                                    },
                                }}
                            />
                        </LocalizationProvider>
                        <Button
                            variant="contained"
                            sx={{ backgroundColor: 'black', color: 'white', height: '56px', px: 3 }}
                            onClick={handleAddMealClick}
                        >
                            Add Meal
                        </Button>
                    </Box>
                    <Typography variant="h5" fontWeight="bold">
                        Eaten on this day
                    </Typography>

                    {meals.map((meal) => (
                        <Paper key={meal.id} elevation={1} sx={{ padding: 2, width: '100%', display: 'flex' }}>
                            <CardMedia
                                component="img"
                                image="https://source.unsplash.com/featured/?food"
                                alt="Meal"
                                sx={{ width: 180, height: 180 }}
                            />
                            <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, pl: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography variant="h5" fontWeight="bold">
                                            {meal.title}
                                        </Typography>
                                        <Typography variant="h5" fontWeight="bold">·</Typography>
                                        <Typography variant="h6">
                                            {meal.calories} kcal
                                        </Typography>
                                    </Box>
                                    <Button
                                        variant="contained"
                                        sx={{ backgroundColor: 'black', color: 'white', height: '40px' }}
                                        onClick={() => handleRemove(meal.id)}
                                    >
                                        Remove
                                    </Button>
                                </Box>
                                <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between' }}>
                                    <Box>
                                        <Typography variant='h6'>{meal.carbohydrates}g Carbohydrates</Typography>
                                        <Typography variant='h6'>{meal.protein}g Protein</Typography>
                                        <Typography variant='h6'>{meal.fat}g Fat</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', pl: 5, pr: 17 }}>
                                        <FormControlLabel
                                            control={<Checkbox checked={meal.containsMeat} disabled size="small" sx={{ color: 'black' }} />}
                                            label={<Typography variant="h6">Contains Meat</Typography>}
                                        />
                                        <FormControlLabel
                                            control={<Checkbox checked={meal.vegetarian} disabled size="small" sx={{ color: 'black' }} />}
                                            label={<Typography variant="h6">Vegetarian</Typography>}
                                        />
                                        <FormControlLabel
                                            control={<Checkbox checked={meal.vegan} disabled size="small" sx={{ color: 'black' }} />}
                                            label={<Typography variant="h6">Vegan</Typography>}
                                        />
                                    </Box>
                                </Box>
                            </Box>
                        </Paper>
                    ))}
                </Stack>

                {/* To add meal */}
                <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
                    <DialogTitle>Add New Meal</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Meal Title"
                            fullWidth
                            value={newMealTitle}
                            onChange={(e) => setNewMealTitle(e.target.value)}
                        />
                        <TextField
                            margin="dense"
                            label="Calories"
                            type="number"
                            fullWidth
                            value={newMealCalories}
                            onChange={(e) => setNewMealCalories(e.target.value === "" ? "" : Number(e.target.value))}
                        />
                        <TextField
                            margin="dense"
                            label="Carbohydrates (g)"
                            type="number"
                            fullWidth
                            value={newMealCarbohydrates}
                            onChange={(e) => setNewMealCarbohydrates(e.target.value === "" ? "" : Number(e.target.value))}
                        />
                        <TextField
                            margin="dense"
                            label="Protein (g)"
                            type="number"
                            fullWidth
                            value={newMealProtein}
                            onChange={(e) => setNewMealProtein(e.target.value === "" ? "" : Number(e.target.value))}
                        />
                        <TextField
                            margin="dense"
                            label="Fat (g)"
                            type="number"
                            fullWidth
                            value={newMealFat}
                            onChange={(e) => setNewMealFat(e.target.value === "" ? "" : Number(e.target.value))}
                        />
                        <FormGroup row>
                            <FormControlLabel
                                control={<Checkbox
                                    checked={newMealType === 'meat'}
                                    onChange={() => setNewMealType('meat')}
                                />}
                                label="Meat"
                            />
                            <FormControlLabel
                                control={<Checkbox
                                    checked={newMealType === 'vegetarian'}
                                    onChange={() => setNewMealType('vegetarian')}
                                />}
                                label="Vegetarian"
                            />
                            <FormControlLabel
                                control={<Checkbox
                                    checked={newMealType === 'vegan'}
                                    onChange={() => setNewMealType('vegan')}
                                />}
                                label="Vegan"
                            />
                        </FormGroup>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
                        <Button variant="contained" onClick={handleSaveMeal}>Save</Button>
                    </DialogActions>
                </Dialog>
            </Paper>
        </Box>
    );
}
