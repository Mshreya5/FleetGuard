import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Truck, Menu, X, UserCircle2, LogOut } from 'lucide-react';
import { COLORS, SHADOWS, RADIUS, FONT, SPACING } from '../tokens';
import { useAuth } from '../context/AuthContext';
import '../pages/Notifications.css';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getLinkStyle = ({ isActive }) => ({
    fontSize: FONT.size.sm,
    fontWeight: FONT.weight.medium,
    color: isActive ? COLORS.primaryLight : COLORS.textSecondary,
    textDecoration: 'none',
    transition: 'color 0.2s ease',
  });

  const headerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    transition: 'background 0.3s ease, box-shadow 0.3s ease',
    background: scrolled ? 'rgba(5,8,16,0.92)' : 'rgba(5,8,16,0.6)',
    backdropFilter: 'blur(20px)',
    borderBottom: `1px solid ${scrolled ? COLORS.border : 'transparent'}`,
    boxShadow: scrolled ? SHADOWS.navbar : 'none',
  };

  const innerStyle = {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: `0 ${SPACING[6]}`,
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'About', to: '/about' },
    { label: 'Features', to: '/features' },
    { label: 'Contact', to: '/contact' },
    ...(isAuthenticated ? [{ label: 'Notifications', to: '/notifications' }] : []),
    ...(isAuthenticated && ['Admin', 'Fleet Manager'].includes(user?.role) ? [{ label: 'Audit Logs', to: '/audit-logs' }] : []),
  ];

  return (
    <header style={headerStyle}>
      <div style={innerStyle}>

        {/* Logo */}
        <NavLink to="/" style={{ display: 'flex', alignItems: 'center', gap: SPACING[2], textDecoration: 'none' }} className="fg-logo">
          <div className="fg-logo-icon" style={{ width: '36px', height: '36px', background: COLORS.primary, borderRadius: RADIUS.card, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: SHADOWS.glowSm }}>
            <Truck size={17} color={COLORS.white} strokeWidth={2} />
          </div>
          <span style={{ fontSize: FONT.size.lg, fontWeight: FONT.weight.bold, color: COLORS.textPrimary, letterSpacing: '-0.3px' }}>
            Fleet<span style={{ color: COLORS.primaryLight }}>Guard</span>
          </span>
        </NavLink>

        <nav className="fg-desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: SPACING[8] }}>
          {navLinks.map(({ label, to }) => (
            <NavLink
              key={label}
              to={to}
              end={to === '/'}
              style={getLinkStyle}
              className="fg-nav-link"
              onMouseEnter={e => e.currentTarget.style.color = COLORS.primaryLight}
              onMouseLeave={e => { if (!e.currentTarget.classList.contains('active')) e.currentTarget.style.color = COLORS.textSecondary; }}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="fg-desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: SPACING[3] }}>
          {isAuthenticated ? (
            <>
              <NavLink
                to="/profile"
                title={`My Profile (${user?.name || user?.email || 'User'})`}
                style={({ isActive }) => ({
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: isActive ? 'rgba(74,144,226,0.22)' : 'rgba(74,144,226,0.08)',
                  border: '1px solid rgba(74,144,226,0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                  transition: 'background 0.2s ease',
                  overflow: 'hidden',
                })}
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <UserCircle2 size={20} color={COLORS.primaryLight} strokeWidth={1.8} />
                )}
              </NavLink>

              <button
                onClick={handleLogout}
                title="Logout"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: SPACING[2],
                  padding: `${SPACING[2]} ${SPACING[4]}`,
                  borderRadius: RADIUS.btn,
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.25)',
                  color: COLORS.danger,
                  fontSize: FONT.size.sm,
                  fontWeight: FONT.weight.semibold,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <LogOut size={14} /> Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/register"
                style={{
                  fontSize: FONT.size.sm,
                  fontWeight: FONT.weight.semibold,
                  color: COLORS.primaryLight,
                  textDecoration: 'none',
                  padding: `${SPACING[2]} ${SPACING[4]}`,
                }}
              >
                Register
              </NavLink>

              <NavLink
                to="/login"
                className="fg-btn-primary fg-pulse-glow"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: `${SPACING[2]} ${SPACING[5]}`,
                  borderRadius: RADIUS.btn,
                  background: COLORS.primary,
                  color: COLORS.white,
                  fontSize: FONT.size.sm,
                  fontWeight: FONT.weight.semibold,
                  textDecoration: 'none',
                }}
              >
                Login
              </NavLink>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="fg-mobile-only"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.textSecondary, padding: SPACING[2] }}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {menuOpen && (
        <div className="fg-mobile-only-block" style={{ background: 'rgba(5,8,16,0.97)', backdropFilter: 'blur(20px)', borderTop: `1px solid ${COLORS.border}`, padding: `${SPACING[4]} ${SPACING[6]}`, display: 'flex', flexDirection: 'column', gap: SPACING[1] }}>
          {navLinks.map(({ label, to }) => (
            <NavLink
              key={label}
              to={to}
              end={to === '/'}
              onClick={() => setMenuOpen(false)}
              style={({ isActive }) => ({ padding: `${SPACING[3]} 0`, fontSize: FONT.size.sm, fontWeight: FONT.weight.medium, color: isActive ? COLORS.primaryLight : COLORS.textSecondary, textDecoration: 'none', borderBottom: `1px solid ${COLORS.border}`, display: 'block' })}
            >
              {label}
            </NavLink>
          ))}

          {isAuthenticated ? (
            <>
              <NavLink
                to="/profile"
                onClick={() => setMenuOpen(false)}
                style={({ isActive }) => ({ padding: `${SPACING[3]} 0`, fontSize: FONT.size.sm, fontWeight: FONT.weight.medium, color: isActive ? COLORS.primaryLight : COLORS.textSecondary, textDecoration: 'none', borderBottom: `1px solid ${COLORS.border}`, display: 'block' })}
              >
                My Profile ({user?.name || 'User'})
              </NavLink>

              <button
                onClick={() => { setMenuOpen(false); handleLogout(); }}
                style={{ marginTop: SPACING[3], padding: `${SPACING[3]} ${SPACING[5]}`, borderRadius: RADIUS.btn, background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: COLORS.danger, fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, width: '100%', cursor: 'pointer' }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/register"
                onClick={() => setMenuOpen(false)}
                style={{ padding: `${SPACING[3]} 0`, fontSize: FONT.size.sm, fontWeight: FONT.weight.medium, color: COLORS.primaryLight, textDecoration: 'none', borderBottom: `1px solid ${COLORS.border}`, display: 'block' }}
              >
                Register
              </NavLink>

              <NavLink
                to="/login"
                onClick={() => setMenuOpen(false)}
                style={{ marginTop: SPACING[3], padding: `${SPACING[3]} ${SPACING[5]}`, borderRadius: RADIUS.btn, background: COLORS.primary, color: COLORS.white, fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, textDecoration: 'none', textAlign: 'center', display: 'block' }}
              >
                Login
              </NavLink>
            </>
          )}
        </div>
      )}
    </header>
  );
}
