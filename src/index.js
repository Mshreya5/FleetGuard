import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Global body styles applied via JavaScript — no CSS file
document.body.style.margin = '0';
document.body.style.padding = '0';
document.body.style.fontFamily = "'Inter', 'Segoe UI', sans-serif";
document.body.style.backgroundColor = '#050810';
document.body.style.color = '#F0F6FF';
document.body.style.webkitFontSmoothing = 'antialiased';
document.documentElement.style.scrollBehavior = 'smooth';

// Inject Inter font via JS
const link = document.createElement('link');
link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap';
link.rel = 'stylesheet';
document.head.appendChild(link);

// Inject global keyframe animations via JS
const style = document.createElement('style');
style.textContent = `
  * { box-sizing: border-box; margin: 0; padding: 0; }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #050810; }
  ::-webkit-scrollbar-thumb { background: #1E3A5F; border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: #2563EB; }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(32px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeInLeft {
    from { opacity: 0; transform: translateX(-32px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes fadeInRight {
    from { opacity: 0; transform: translateX(32px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-12px); }
  }
  @keyframes pulseGlow {
    0%, 100% { box-shadow: 0 0 10px rgba(74,144,226,0.3); }
    50%       { box-shadow: 0 0 28px rgba(74,144,226,0.75); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes slideIn {
    from { width: 0; }
    to   { width: 100%; }
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }

  .fg-fade-up   { animation: fadeInUp   0.7s ease forwards; }
  .fg-fade-up-1 { animation: fadeInUp   0.7s ease 0.15s forwards; opacity: 0; }
  .fg-fade-up-2 { animation: fadeInUp   0.7s ease 0.30s forwards; opacity: 0; }
  .fg-fade-up-3 { animation: fadeInUp   0.7s ease 0.45s forwards; opacity: 0; }
  .fg-fade-left { animation: fadeInLeft 0.7s ease forwards; }
  .fg-fade-right{ animation: fadeInRight 0.7s ease 0.2s forwards; opacity: 0; }
  .fg-float     { animation: float 4s ease-in-out infinite; }
  .fg-pulse-glow{ animation: pulseGlow 2.5s ease-in-out infinite; }

  .fg-shimmer-text {
    background: linear-gradient(90deg, #60A5FA 0%, #ffffff 40%, #60A5FA 80%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 3s linear infinite;
  }

  .fg-nav-link::after {
    content: '';
    display: block;
    height: 2px;
    width: 0;
    background: #60A5FA;
    border-radius: 2px;
    transition: width 0.3s ease;
    margin-top: 2px;
  }
  .fg-nav-link:hover::after { width: 100%; }

  .fg-feature-card { transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease; }
  .fg-feature-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 12px 40px rgba(74,144,226,0.28);
    border-color: rgba(74,144,226,0.6) !important;
  }
  .fg-feature-card:hover .fg-card-top-line { width: 100%; }
  .fg-feature-card:hover .fg-icon-box {
    background: rgba(74,144,226,0.25);
    box-shadow: 0 0 14px rgba(74,144,226,0.4);
  }

  .fg-card-top-line {
    position: absolute; top: 0; left: 0;
    height: 2px; width: 0;
    background: #4A90E2; border-radius: 2px 2px 0 0;
    transition: width 0.35s ease;
  }

  .fg-benefit-row { transition: background 0.2s ease, border-left 0.2s ease; border-left: 2px solid transparent; }
  .fg-benefit-row:hover {
    background: rgba(74,144,226,0.1);
    border-left: 2px solid #4A90E2;
    border-radius: 0 8px 8px 0;
  }

  .fg-metric-tile { transition: background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease; }
  .fg-metric-tile:hover {
    background: rgba(74,144,226,0.12);
    border-color: rgba(74,144,226,0.5);
    box-shadow: 0 0 12px rgba(74,144,226,0.3);
  }

  .fg-btn-primary { transition: background 0.2s ease, box-shadow 0.2s ease, gap 0.2s ease; }
  .fg-btn-primary:hover {
    background: #2563EB !important;
    box-shadow: 0 0 24px rgba(74,144,226,0.55);
  }

  .fg-btn-outline { transition: border-color 0.2s ease, color 0.2s ease, background 0.2s ease; }
  .fg-btn-outline:hover {
    border-color: #4A90E2 !important;
    color: #60A5FA !important;
    background: rgba(74,144,226,0.08);
  }

  .fg-footer-link { transition: color 0.2s ease; }
  .fg-footer-link:hover { color: #60A5FA !important; }

  .fg-logo:hover .fg-logo-icon {
    box-shadow: 0 0 20px rgba(74,144,226,0.6);
    transform: scale(1.1);
  }
  .fg-logo-icon { transition: box-shadow 0.25s ease, transform 0.25s ease; }

  /* Responsive utilities */
  .fg-desktop-nav { display: flex; }
  .fg-mobile-only { display: none; }
  .fg-mobile-only-block { display: block; }

  @media (max-width: 768px) {
    .fg-desktop-nav { display: none !important; }
    .fg-mobile-only { display: block !important; }
  }
  @media (min-width: 769px) {
    .fg-mobile-only { display: none !important; }
    .fg-mobile-only-block { display: none !important; }
  }
`;
document.head.appendChild(style);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
