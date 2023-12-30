"use client";
import { loginUser } from "@/lib/api/auth";
import { AuthContext } from "@/lib/providers/auth-provider";
import { Button, Input } from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Page() {
  const user = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/projects");
    }
  }, [user]);

  async function onLogin() {
    setLoading(true);
    const successful = await loginUser(email, password);
    setLoading(false);
    if (successful) {
      router.push("/projects");
    } else {
      toast.error("Login failed");
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="flex flex-col gap-4">
        <Input
          name="email"
          label="Email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          crossOrigin={null}
        />
        <Input
          name="password"
          type="password"
          label="Password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          crossOrigin={null}
        />
        <Button onClick={onLogin} loading={loading}>
          Login
        </Button>
      </div>
    </div>
  );
}
