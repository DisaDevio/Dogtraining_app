import type { ReactNode } from "react";
import { useAuth } from "../../hooks/useAuth";
import LoginForm from "./LoginForm";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "rgba(87, 91, 58, 0.9)",
          color: "white",
        }}
      >
        Loading...
      </div>
    );
  }

  if (!isLoggedIn) {
    return <LoginForm />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
