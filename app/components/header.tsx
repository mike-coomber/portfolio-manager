"use client";
import { useRouter } from "next/navigation";
import { logout } from "../../lib/api/auth";
import toast from "react-hot-toast";
import { useContext } from "react";
import { AuthContext } from "../../lib/providers/auth-provider";
import { Typography } from "@material-tailwind/react";
import Link from "next/link";

export default function Header() {
  const router = useRouter();
  const user = useContext(AuthContext);

  async function onLogout() {
    const successful = await logout();

    if (successful) {
      toast.success("Logged out successfully");
      router.push("/login");
    } else {
      toast.error("Error logging out");
    }
  }

  return (
    <header className="bg-light-blue-700 p-4 text-lg text-white flex justify-between">
      <Link href={"/projects"} className="cursor-pointer">
        Portfolio manager
      </Link>
      {user && (
        <div className="flex gap-2 items-center">
          <Typography variant="small">{user.email}</Typography>
          <span
            className="flex material-symbols-rounded cursor-pointer"
            onClick={onLogout}
          >
            logout
          </span>
        </div>
      )}
    </header>
  );
}
