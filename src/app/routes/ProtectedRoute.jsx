import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@features/auth/hooks/useAuth";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Memuat...
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
