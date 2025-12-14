import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "@app/layouts/MainLayout";
import AuthLayout from "@app/layouts/AuthLayout";
import LoginPage from "@features/auth/pages/LoginPage";
import RegisterPage from "@features/auth/pages/RegisterPage";
import DashboardPage from "@features/dashboard/pages/DashboardPage";
import MyCoursesPage from "@features/mycourses/pages/MyCoursesPage";
import InsightsPage from "@features/insights/pages/InsightsPage";
import ProtectedRoute from "./ProtectedRoute";
import { DashboardProvider } from "@features/dashboard/context/DashboardContext";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardProvider>
              <MainLayout />
            </DashboardProvider>
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="mycourses" element={<MyCoursesPage />} />
        <Route path="insights" element={<InsightsPage />} />
      </Route>

      {/* 404 */}
      <Route
        path="*"
        element={
          <div className="p-8 text-center text-xl">
            404 - Halaman Tidak Ditemukan
          </div>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
