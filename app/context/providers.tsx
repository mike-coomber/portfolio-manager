"use client";
import { ThemeProvider } from "@material-tailwind/react";
import { WorkContext } from "./contexts";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
