"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { useAuth } from "../../context/AuthContext";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await signUp(email, password);
    if (error) alert(error.message);
    else router.push("/");
  };

  return (
    <Paper
      elevation={4}
      sx={{
        p: 4,
        bgcolor: "#E0FFE0",
        borderRadius: 3,
        minWidth: 340,
        mx: "auto",
        mt: 8,
      }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        color="#1a3a1a"
        mb={3}
        align="center"
      >
        SIGN UP
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            mt: 3,
            bgcolor: "#388E3C",
            "&:hover": { bgcolor: "#2E7D32" },
            borderRadius: 2,
            py: 1.5,
          }}
        >
          Sign Up
        </Button>
      </Box>
      <Typography mt={2} align="center">
        Already have an account? <a href="/login">Login</a>
      </Typography>
    </Paper>
  );
}
