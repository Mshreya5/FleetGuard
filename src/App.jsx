import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
<<<<<<< HEAD
import Home from './pages/Home';
import About from './pages/About';
import Features from './pages/Features';
import Contact from './pages/Contact';
import Profile from './pages/Profile';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<Features />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
=======
import { NotificationProvider } from './context/NotificationContext';
import Home               from './pages/Home';
import About              from './pages/About';
import Features           from './pages/Features';
import Contact            from './pages/Contact';
import Profile            from './pages/Profile';
import AuditLog           from './pages/AuditLog';
import NotificationCenter from './pages/NotificationCenter';
import LogoutPage         from './pages/LogoutPage';

export default function App() {
  return (
    <NotificationProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"              element={<Home />} />
          <Route path="/about"         element={<About />} />
          <Route path="/features"      element={<Features />} />
          <Route path="/contact"       element={<Contact />} />
          <Route path="/profile"       element={<Profile />} />
          <Route path="/audit-logs"    element={<AuditLog />} />
          <Route path="/notifications" element={<NotificationCenter />} />
          <Route path="/logout"        element={<LogoutPage />} />
        </Routes>
      </BrowserRouter>
    </NotificationProvider>
>>>>>>> da9cfe25b6596b8c858205d4795f54a51cc308c1
  );
}