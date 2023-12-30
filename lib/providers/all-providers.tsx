"use client";
import { ThemeProvider } from "@material-tailwind/react";
import { AuthContextProvider } from "./auth-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthContextProvider>{children}</AuthContextProvider>
    </ThemeProvider>
  );
}
