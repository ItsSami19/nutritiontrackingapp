import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NutritiontrackingAPP",
  description:
    "NutritiontrackingAPP is a web application that helps you track your nutrition and fitness goals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
