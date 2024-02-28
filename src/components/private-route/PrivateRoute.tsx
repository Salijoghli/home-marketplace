import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/use-auth/useAuth";
import { Spinner } from "../loading-spinner/Spinner";

export const PrivateRoute = () => {
  const { loggedIn, loading } = useAuth();
  if (loading) {
    return <Spinner />;
  }
  return loggedIn ? <Outlet /> : <Navigate to={"/sign-in"} />;
};
