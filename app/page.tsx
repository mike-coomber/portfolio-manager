"use client";
import { AuthContext } from "@/lib/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";

export default function Home() {
  const user = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/projects");
    } else {
      router.push("/login");
    }
  }, [user, router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24"></main>
  );
}
