import { useState } from "react";
import { useNavigate } from "react-router";
import useAuthStore from "../store/authStore";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function LoginPage() {
  const [name, setName] = useState<string>("");

  // Pull only the login action from the Zustand store.
  const login = useAuthStore((state) => state.login);

  const navigate = useNavigate();

  const handleLogin = (): void => {
    login(name);
    navigate("/claims");
  };

  return (
    <div className="max-w-sm">
      <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
        Login
      </h2>

      <div className="grid gap-1.5">
        <Label htmlFor="name" className="text-foreground">
          Your Name
        </Label>

        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Juan dela Cruz"
        />
      </div>

      <Button
        onClick={handleLogin}
        disabled={name === ""}
        className="mt-3"
      >
        Log In
      </Button>
    </div>
  );
}

export default LoginPage;