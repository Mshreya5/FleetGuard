import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Truck, Menu, X, UserCircle2 } from 'lucide-react';
import { COLORS, SHADOWS, RADIUS, FONT, SPACING } from '../tokens';

const navLinks = [
  { label: 'Home',     to: '/' },
  { label: 'About',    to: '/about' },
  { label: 'Features', to: '/features' },
  { label: 'Contact',  to: '/contact' },
];

export default function Navbar() {
  const [open, setOpen]         = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const linkStyle = ({ isActive }) => ({
    fontSize: FONT.size.sm,
    fontWeight: FONT.weight.medium,
    color: isActive ? COLORS.primaryLight : COLORS.textSecondary,
    textDecoration: 'none',
    transition: 'color 0.2s ease',
  });

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      transition: 'background 0.3s ease, box-shadow 0.3s ease',
      background: scrolled ? 'rgba(5,8,16,0.92)' : 'rgba(5,8,16,0.6)',
      backdropFilter: 'blur(20px)',
      borderBottom: `1px solid ${scrolled ? COLORS.border : 'transparent'}`,
      boxShadow: scrolled ? SHADOWS.navbar : 'none',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: `0 ${SPACING[6]}`, height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

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
              style={linkStyle}
              className="fg-nav-link"
              onMouseEnter={e => e.currentTarget.style.color = COLORS.primaryLight}
              onMouseLeave={e => { if (!e.currentTarget.classList.contains('active')) e.currentTarget.style.color = COLORS.textSecondary; }}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="fg-desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: SPACING[3] }}>
          <NavLink
            to="/profile"
            title="My Profile"
            style={({ isActive }) => ({
              width: '36px', height: '36px', borderRadius: '50%',
              background: isActive ? 'rgba(74,144,226,0.22)' : 'rgba(74,144,226,0.08)',
              border: `1px solid rgba(74,144,226,0.25)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              textDecoration: 'none', transition: 'background 0.2s ease',
            })}
          >
            <UserCircle2 size={20} color={COLORS.primaryLight} strokeWidth={1.8} />
          </NavLink>

          <a
            href="/login"
            className="fg-btn-primary fg-pulse-glow"
            style={{ display: 'inline-flex', alignItems: 'center', padding: `${SPACING[2]} ${SPACING[5]}`, borderRadius: RADIUS.btn, background: COLORS.primary, color: COLORS.white, fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, textDecoration: 'none' }}
          >
            Login
          </a>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="fg-mobile-only"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.textSecondary, padding: SPACING[2] }}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="fg-mobile-only-block" style={{ background: 'rgba(5,8,16,0.97)', backdropFilter: 'blur(20px)', borderTop: `1px solid ${COLORS.border}`, padding: `${SPACING[4]} ${SPACING[6]}`, display: 'flex', flexDirection: 'column', gap: SPACING[1] }}>
          {navLinks.map(({ label, to }) => (
            <NavLink
              key={label}
              to={to}
              end={to === '/'}
              onClick={() => setOpen(false)}
              style={({ isActive }) => ({ padding: `${SPACING[3]} 0`, fontSize: FONT.size.sm, fontWeight: FONT.weight.medium, color: isActive ? COLORS.primaryLight : COLORS.textSecondary, textDecoration: 'none', borderBottom: `1px solid ${COLORS.border}`, display: 'block' })}
            >
              {label}
            </NavLink>
          ))}
          <NavLink
            to="/profile"
            onClick={() => setOpen(false)}
            style={({ isActive }) => ({ padding: `${SPACING[3]} 0`, fontSize: FONT.size.sm, fontWeight: FONT.weight.medium, color: isActive ? COLORS.primaryLight : COLORS.textSecondary, textDecoration: 'none', borderBottom: `1px solid ${COLORS.border}`, display: 'block' })}
          >
            My Profile
          </NavLink>
          <a
            href="/login"
            onClick={() => setOpen(false)}
            style={{ marginTop: SPACING[3], padding: `${SPACING[3]} ${SPACING[5]}`, borderRadius: RADIUS.btn, background: COLORS.primary, color: COLORS.white, fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, textDecoration: 'none', textAlign: 'center', display: 'block' }}
          >
            Login
          </a>
        </div>
      )}
    </header>
  );
}
