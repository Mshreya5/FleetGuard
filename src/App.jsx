import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Features from './pages/Features';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import Login from './pages/Login';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<Features />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/Login" element={<Login />} />
        <Route 
 path="/admin/dashboard" 

/>

<Route 
 path="/fleetmanager/dashboard" 
 
/>

<Route 
 path="/driver/dashboard" 

/>

<Route 
 path="/servicecenter/dashboard" 

/>
      </Routes>
    </BrowserRouter>
  );
}