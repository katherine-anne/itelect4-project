import { Navigate, Outlet } from "react-router";
import useAuthStore from "../store/authStore";

function ProtectedRoute() {
  const token = useAuthStore((state) => state.token);

  // If there is no token, redirect the user to the login page.
  if (token === null) {
    return <Navigate to="/login" replace />;
  }

  // If a token exists, render the protected child route.
  return <Outlet />;
}

export default ProtectedRoute;