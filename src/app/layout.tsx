"use client";

import Navbar from "./components/navbar";
import { CssBaseline, Container } from "@mui/material";
import { SessionProvider } from "next-auth/react";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <CssBaseline />
        <SessionProvider>
          <Navbar />
          <Container sx={{ mt: 4 }}>{children}</Container>
        </SessionProvider>
      </body>
    </html>
  );
}
