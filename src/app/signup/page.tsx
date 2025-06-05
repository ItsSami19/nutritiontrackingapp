"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { signIn } from "next-auth/react";

export default function SignUpPage() {
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
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Signup failed");
      }

      // Auto-login after signup
      const signInResult = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (signInResult?.error) {
        router.push("/login");
      } else {
        router.push("/");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper
      elevation={4}
      sx={{
        p: 4,
        bgcolor: "#E0FFE0",
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
        color="#1a3a1a"
        mb={3}
        align="center"
      >
        SIGN UP
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
          autoComplete="new-password"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={isLoading}
          sx={{
            mt: 3,
            bgcolor: "#388E3C",
            "&:hover": { bgcolor: "#2E7D32" },
            borderRadius: 2,
            py: 1.5,
          }}
        >
          {isLoading ? "Creating Account..." : "Sign Up"}
        </Button>
      </Box>
      <Typography mt={2} align="center">
        Already have an account?{" "}
        <a href="/login" style={{ color: "#388E3C", fontWeight: "bold" }}>
          Login
        </a>
      </Typography>
    </Paper>
  );
}
