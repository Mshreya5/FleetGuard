import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';

// Blank dashboards — team members will build these out
const Placeholder = () => (
  <div style={{ minHeight:'100vh', background:'#0f172a' }} />
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard/fleet-manager"  element={<Placeholder role="Fleet Manager" />} />
        <Route path="/dashboard/driver"         element={<Placeholder role="Driver" />} />
        <Route path="/dashboard/service-center" element={<Placeholder role="Service Center" />} />
        <Route path="/dashboard/admin"          element={<Placeholder role="Admin" />} />
      </Routes>
    </BrowserRouter>
  );
}
