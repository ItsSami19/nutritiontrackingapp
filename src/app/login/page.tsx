"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      if (result?.ok) {
        router.push("/");
        return;
      }

      throw new Error("Login failed");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Paper
      elevation={4}
      sx={{
        p: 4,
        bgcolor: "#EAD9FF",
        borderRadius: 3,
        minWidth: 340,
        maxWidth: 400,
        mx: "auto",
        mt: 8,
      }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        color="#2d1a3a"
        mb={3}
        align="center"
      >
        LOGIN
      </Typography>

      {error && (
        <Typography color="error" mb={2} align="center">
          {error}
        </Typography>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
          margin="normal"
          autoComplete="email"
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          fullWidth
          margin="normal"
          autoComplete="current-password"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={isLoading}
          sx={{
            mt: 3,
            bgcolor: "#5E3D84",
            "&:hover": { bgcolor: "#482963" },
            borderRadius: 2,
            py: 1.5,
          }}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : "Login"}
        </Button>
      </Box>
      <Typography mt={2} align="center">
        Don't have an account?{" "}
        <a href="/signup" style={{ color: "#5E3D84", fontWeight: "bold" }}>
          Sign Up
        </a>
      </Typography>
    </Paper>
  );
}
