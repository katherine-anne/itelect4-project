import { useState } from "react";
import { useNavigate } from "react-router";
import useAuthStore from "../store/authStore";

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

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        className="w-full rounded border border-gray-300 bg-white p-2 text-gray-900 placeholder:text-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400"
      />

      <button
        onClick={handleLogin}
        disabled={name === ""}
        className="mt-3 rounded bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:bg-gray-400"
      >
        Log In
      </button>
    </div>
  );
}

export default LoginPage;