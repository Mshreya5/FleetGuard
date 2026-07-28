import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import About from '../components/About';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div style={{ background: '#050810', color: '#F0F6FF', fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <About />
      </main>
      <Footer />
    </div>
  );
}
