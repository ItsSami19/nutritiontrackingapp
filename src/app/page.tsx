"use client";
import { Typography, Button, Box } from "@mui/material";
import { useRequireAuth } from "../hooks/useRequireAuth";
import { useAuth } from "../context/AuthContext";

export default function DashboardPage() {
  const user = useRequireAuth();
  const { signOut } = useAuth();

  return (
    <Box sx={{ p: 4, textAlign: "center" }}>
      <Typography variant="h3">Welcome, {user?.email}!</Typography>
      <Button variant="contained" onClick={() => signOut()} sx={{ mt: 4 }}>
        Logout
      </Button>
    </Box>
  );
}
