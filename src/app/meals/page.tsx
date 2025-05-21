'use client';
//import * as React from 'react';
import { useState } from "react";
import { Box, Button, Typography, Paper, Stack, TextField, CardMedia, Checkbox, FormControlLabel } from '@mui/material';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function Home() {
    const [date, setDate] = useState<Date | null>(new Date());


    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="20vh">
            <Paper elevation={2} sx={{ padding: 4, width: 1100 }}>
                <Stack spacing={2} sx={{justifyContent: "flex-start", alignItems: "stretch"}}>
                    <Box display="flex" justifyContent="space-between">
                        <Typography variant="h4" fontWeight="bold">
                            Meal Library
                        </Typography>
                        <Button variant="contained" sx={{backgroundColor: 'black', color: 'white', height: '56px', px:3}}>
                            Add Meal
                        </Button>
                    </Box>


                    {// Meal Card
                    }
                    <Paper elevation={1} sx={{ padding: 2, width: '100%' , display: 'flex'}}>
                        <CardMedia
                        component="img"
                        image="https://takethemameal.com/files_images_v2/stam.jpg"
                        alt="Nice Meal"
                        sx={{width: 180, height: 180}}
                        /> 
                        <Box sx={{display: 'flex', flexDirection: 'column', flex: 1, pl: 3}}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography variant="h5" fontWeight="bold">
                                            Nice Meal 1
                                    </Typography>
                                    <Typography variant="h5" fontWeight="bold">
                                            ·
                                    </Typography>
                                    <Typography variant="h6">
                                            5/5 Stars
                                    </Typography>
                                    <Typography variant="h5" fontWeight="bold">
                                            ·
                                    </Typography>
                                    <Typography variant="h6">
                                            🌳-Score: Low
                                    </Typography>
                                </Box>
                                <Box sx={{display:'flex', gap:2}}>
                                    <Button variant="contained" sx={{ backgroundColor: 'black', color: 'white', height: '40px', width: '90px' }}>
                                    Edit
                                    </Button>
                                    <Button variant="contained" sx={{ backgroundColor: 'black', color: 'white', height: '40px', width: '90px' }}>
                                    Remove
                                    </Button>
                                </Box>
                            </Box>
                            <Box sx={{mt: 2, display: 'flex', justifyContent: 'space-between'}}>
                                <Box>
                                    <Typography variant='h6'>187 kcal</Typography>
                                    <Typography variant='h6'>7295g Carbohydrates</Typography>
                                    <Typography variant='h6'>1467g Protein</Typography>
                                    <Typography variant='h6'>3141g Fat</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column', pl: 5, pr: 17 }}>
                                    <FormControlLabel
                                        control={<Checkbox checked size="small" sx={{color: 'black', '&.Mui-checked': {color: 'black'},}} />}
                                        label={<Typography variant="h6">Contains Meat</Typography>}
                                    />
                                    <FormControlLabel
                                        control={<Checkbox size="small" sx={{color: 'black', '&.Mui-checked': {color: 'black'},}} />}
                                        label={<Typography variant="h6">Vegetarian</Typography>}
                                    />
                                    <FormControlLabel
                                        control={<Checkbox size="small" sx={{color: 'black', '&.Mui-checked': {color: 'black'},}} />}
                                        label={<Typography variant="h6">Vegan</Typography>}
                                    />
                                </Box>
                            </Box>
                        </Box>
                    </Paper>
                    <Paper elevation={1} sx={{ padding: 2, width: '100%' , display: 'flex'}}>
                        <CardMedia
                        component="img"
                        image="https://feiertaeglich.de/wp-content/uploads/2020/01/Brokkoli-Dinkel-Power-Bowl-mit-cremigem-Cashewdressing_q1.jpg"
                        alt="Nice Meal"
                        sx={{width: 180, height: 180}}
                        /> 
                        <Box sx={{display: 'flex', flexDirection: 'column', flex: 1, pl: 3}}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography variant="h5" fontWeight="bold">
                                            Nice Meal 2
                                    </Typography>
                                    <Typography variant="h5" fontWeight="bold">
                                            ·
                                    </Typography>
                                    <Typography variant="h6">
                                            4/5 Stars
                                    </Typography>
                                    <Typography variant="h5" fontWeight="bold">
                                            ·
                                    </Typography>
                                    <Typography variant="h6">
                                            🌳-Score: High
                                    </Typography>
                                </Box>
                                <Box sx={{display:'flex', gap:2}}>
                                    <Button variant="contained" sx={{ backgroundColor: 'black', color: 'white', height: '40px', width: '90px' }}>
                                    Edit
                                    </Button>
                                    <Button variant="contained" sx={{ backgroundColor: 'black', color: 'white', height: '40px', width: '90px' }}>
                                    Remove
                                    </Button>
                                </Box>
                            </Box>
                            <Box sx={{mt: 2, display: 'flex', justifyContent: 'space-between'}}>
                                <Box>
                                    <Typography variant='h6'>187 kcal</Typography>
                                    <Typography variant='h6'>7295g Carbohydrates</Typography>
                                    <Typography variant='h6'>1467g Protein</Typography>
                                    <Typography variant='h6'>3141g Fat</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column', pl: 5, pr: 17 }}>
                                    <FormControlLabel
                                        control={<Checkbox size="small" sx={{color: 'black', '&.Mui-checked': {color: 'black'},}} />}
                                        label={<Typography variant="h6">Contains Meat</Typography>}
                                    />
                                    <FormControlLabel
                                        control={<Checkbox checked size="small" sx={{color: 'black', '&.Mui-checked': {color: 'black'},}} />}
                                        label={<Typography variant="h6">Vegetarian</Typography>}
                                    />
                                    <FormControlLabel
                                        control={<Checkbox checked size="small" sx={{color: 'black', '&.Mui-checked': {color: 'black'},}} />}
                                        label={<Typography variant="h6">Vegan</Typography>}
                                    />
                                </Box>
                            </Box>
                        </Box>
                    </Paper>
                </Stack>
            </Paper>
        </Box>

    )
}