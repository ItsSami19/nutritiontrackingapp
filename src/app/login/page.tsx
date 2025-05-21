'use client';

import { useState } from 'react';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert('Submitted!');
  };

  return (
      <Paper
        elevation={4}
        sx={{
          p: 4,
          bgcolor: '#EAD9FF',
          borderRadius: 3,
          minWidth: 340,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" fontWeight="bold" color="#2d1a3a" mb={3} align="center">
          LOGIN
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            required
            InputLabelProps={{ style: { color: '#5E3D84' } }}
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            required
            InputLabelProps={{ style: { color: '#5E3D84' } }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              bgcolor: '#5E3D84',
              color: 'white',
              fontWeight: 'bold',
              '&:hover': { bgcolor: '#482963' },
              borderRadius: 2,
              py: 1.5,
            }}
          >
            Login
          </Button>
        </Box>
      </Paper>
  );
}
