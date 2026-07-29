import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

document.body.style.margin = '0';
document.body.style.padding = '0';
document.body.style.fontFamily = "'Inter', 'Segoe UI', sans-serif";
document.body.style.backgroundColor = '#050810';
document.body.style.color = '#F0F6FF';

const fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap';
fontLink.rel = 'stylesheet';
document.head.appendChild(fontLink);

const style = document.createElement('style');
style.textContent = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', 'Segoe UI', sans-serif; background-color: #050810; color: #F0F6FF; }
  a { text-decoration: none; }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #050810; }
  ::-webkit-scrollbar-thumb { background: #1E3A5F; border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: #2563EB; }

  .fg-nav-link { color: #94A3B8; }
  .fg-nav-link.active { color: #60A5FA; }

  .fg-feature-card { border: 1px solid #1E3A5F; }
  .fg-card-top-line { position: absolute; top: 0; left: 0; height: 2px; width: 100%; background: #4A90E2; border-radius: 2px 2px 0 0; }
  .fg-metric-tile { border: 1px solid #1E3A5F; }
  .fg-btn-primary:hover { opacity: 0.92; }
  .fg-btn-outline:hover { border-color: #4A90E2; color: #60A5FA; }
  .fg-footer-link { color: #94A3B8; }
  .fg-footer-link:hover { color: #60A5FA; }

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
