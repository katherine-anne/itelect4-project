import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import { loginUser } from "../api/client";
import useAuthStore from "../store/authStore";
import { loginSchema, type LoginFormValues } from "../schemas/authSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function LoginPage() {
  const setSession = useAuthStore((state) => state.setSession);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: { email: "", password: "" },
  });

  const logIn = useMutation({
    mutationFn: loginUser,
    onSuccess: (reply) => {
      setSession(reply.token, reply.user.name);
      navigate("/claims");
    },
  });

  return (
    <div className="max-w-sm">
      <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
        Login
      </h2>

      <form
        onSubmit={handleSubmit((values) => logIn.mutate(values))}
        className="grid gap-4"
      >
        <div className="grid gap-1.5">
          <Label htmlFor="email" className="text-foreground">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            {...register("email")}
            aria-invalid={errors.email ? true : undefined}
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="password" className="text-foreground">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            {...register("password")}
            aria-invalid={errors.password ? true : undefined}
          />
          {errors.password && (
            <p className="text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        {logIn.isError && (
          <p role="alert" className="text-sm text-red-700">
            {logIn.error.message}
          </p>
        )}

        <Button type="submit" disabled={logIn.isPending}>
          {logIn.isPending ? "Logging in..." : "Log In"}
        </Button>
      </form>

      <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
        New here? <Link className="text-blue-600 underline" to="/register">Create an account</Link>
      </p>
    </div>
  );
}

export default LoginPage;
