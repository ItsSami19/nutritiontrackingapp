"use client";
import { Typography, Button, Box, CircularProgress } from "@mui/material";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, textAlign: "center" }}>
      <Typography variant="h3" gutterBottom>
        Welcome, {session?.user?.email}!
      </Typography>

      <Button
        variant="contained"
        onClick={() => signOut({ callbackUrl: "/login" })}
        sx={{
          mt: 4,
          bgcolor: "#5E3D84",
          "&:hover": { bgcolor: "#482963" },
        }}
      >
        Logout
      </Button>

      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Get Started
        </Typography>
        <Button
          variant="outlined"
          onClick={() => router.push("/tracking")}
          sx={{ mx: 1 }}
        >
          Track Nutrition
        </Button>
        <Button
          variant="outlined"
          onClick={() => router.push("/meals")}
          sx={{ mx: 1 }}
        >
          My Meals
        </Button>
      </Box>
    </Box>
  );
}
