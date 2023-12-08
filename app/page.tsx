"use client";
import { ThemeProvider } from "@material-tailwind/react";

export default function Home() {
  return (
    <ThemeProvider>
      <main className="flex min-h-screen flex-col items-center justify-between p-24"></main>
    </ThemeProvider>
  );
}
