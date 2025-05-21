'use client';

import Navbar from './components/navbar';
import { CssBaseline, Container } from '@mui/material';

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <CssBaseline />
        <Navbar />
        <Container sx={{ mt: 4 }}>
          {children}
        </Container>
      </body>
    </html>
  );
}
