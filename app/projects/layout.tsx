"use client";
import { AuthContext } from "@/lib/providers/auth-provider";
import { useRouter } from "next/navigation";
import { ReactNode, useContext } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  const user = useContext(AuthContext);
  const router = useRouter();

  if (!user) {
    router.push("/login");
  }

  return children;
}
