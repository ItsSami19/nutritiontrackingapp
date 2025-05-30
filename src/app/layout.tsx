"use client";

import Navbar from "./components/navbar";
import { CssBaseline, Container } from "@mui/material";
import { AuthProvider } from "../context/AuthContext"; // Pfad ggf. anpassen

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <CssBaseline />
        <AuthProvider>
          <Navbar />
          <Container sx={{ mt: 4 }}>{children}</Container>
        </AuthProvider>
      </body>
    </html>
  );
}
