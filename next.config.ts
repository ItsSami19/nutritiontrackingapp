import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* deine anderen Optionen… */
  eslint: {
    // ignoriert alle ESLint-Fehler im Build-Prozess
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
