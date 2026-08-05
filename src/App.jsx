import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { NotificationProvider } from "./context/NotificationContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import About from "./pages/About";
import Features from "./pages/Features";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import AuditLog from "./pages/AuditLog";
import NotificationCenter from "./pages/NotificationCenter";
import LogoutPage from "./pages/LogoutPage";
import Login from "./pages/Login";
import Register from "./pages/Register";

import AdminDashboard from "./modules/Admin";
import DriverDashboard from "./modules/Driver/DriverDashboard";
import FleetManagerApp from "./modules/FleetManager/front_end/src/App";
import ServiceCenterModule from "./modules/ServiceCenter/ServiceCenterModule";

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/features" element={<Features />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/logout" element={<LogoutPage />} />

            {/* Common Protected Routes */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <NotificationCenter />
                </ProtectedRoute>
              }
            />

            <Route
              path="/audit-logs"
              element={
                <ProtectedRoute allowedRoles={['Admin', 'Fleet Manager']}>
                  <AuditLog />
                </ProtectedRoute>
              }
            />

            {/* Role Dashboard Protected Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/fleetmanager/*"
              element={
                <ProtectedRoute allowedRoles={['Admin', 'Fleet Manager']}>
                  <FleetManagerApp />
                </ProtectedRoute>
              }
            />
            <Route
              path="/FleetManager/front_end/DashboardPage"
              element={
                <ProtectedRoute allowedRoles={['Admin', 'Fleet Manager']}>
                  <FleetManagerApp />
                </ProtectedRoute>
              }
            />

            <Route
              path="/driver"
              element={
                <ProtectedRoute allowedRoles={['Driver', 'Admin']}>
                  <DriverDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/driver/*"
              element={
                <ProtectedRoute allowedRoles={['Driver', 'Admin']}>
                  <DriverDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/servicecenter/*"
              element={
                <ProtectedRoute allowedRoles={['Service Center', 'Admin']}>
                  <ServiceCenterModule />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
}
