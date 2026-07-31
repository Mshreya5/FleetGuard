import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NotificationProvider } from "./context/NotificationContext";

import Home from "./pages/Home";
import About from "./pages/About";
import Features from "./pages/Features";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import AuditLog from "./pages/AuditLog";
import NotificationCenter from "./pages/NotificationCenter";
import LogoutPage from "./pages/LogoutPage";
import Login from "./pages/Login";

import AdminDashboard from "./modules/Admin";
import DriverDashboard from "./modules/Driver/DriverDashboard";
import FleetManagerApp from "./modules/FleetManager/front_end/src/App";
import ServiceCenterModule from "./modules/ServiceCenter/ServiceCenterModule";

export default function App() {
  return (
    <NotificationProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/audit-logs" element={<AuditLog />} />
          <Route path="/notifications" element={<NotificationCenter />} />
          <Route path="/logout" element={<LogoutPage />} />
          <Route path="/login" element={<Login />} />

          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          <Route path="/driver/dashboard" element={<DriverDashboard />} />

          <Route path="/fleetmanager/*" element={<FleetManagerApp />} />
          <Route
            path="/FleetManager/front_end/DashboardPage"
            element={<FleetManagerApp />}
          />

          <Route path="/servicecenter/*" element={<ServiceCenterModule />} />
        </Routes>
      </BrowserRouter>
    </NotificationProvider>
  );
}
