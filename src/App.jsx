import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { NotificationProvider } from './context/NotificationContext';
import Home from './pages/Home';
import About from './pages/About';
import Features from './pages/Features';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import AuditLog from './pages/AuditLog';
import NotificationCenter from './pages/NotificationCenter';
import Login from './pages/Login';
import AdminDashboard from "./pages/admin/AdminDashboard";
import DriverDashboard from './modules/Driver/DriverDashboard';

export default function App() {
  return (
    <NotificationProvider>
      <BrowserRouter>
        <Routes>
          
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/audit-logs" element={<AuditLog />} />
          <Route path="/notifications" element={<NotificationCenter />} />
          <Route path="/login" element={<Login />} />
          <Route path="/driver/dashboard" element={<DriverDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </NotificationProvider>
  );
}
