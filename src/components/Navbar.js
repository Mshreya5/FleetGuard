import React, { useState, useEffect } from 'react';
import { Truck, Menu, X } from 'lucide-react';
import { COLORS, SHADOWS, RADIUS, FONT, SPACING } from '../tokens';

const navLinks = [
  { label: 'Home',    href: '#home' },
  { label: 'About',   href: '#about' },
  { label: 'Contact', href: '#contact' },
];

const S = {
  header: (scrolled) => ({
    position: 'fixed',
    top: 0, left: 0, right: 0,
    zIndex: 50,
    transition: 'background 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
    background: scrolled ? 'rgba(5,8,16,0.85)' : 'transparent',
    backdropFilter: scrolled ? 'blur(20px)' : 'none',
    borderBottom: `1px solid ${scrolled ? COLORS.border : 'transparent'}`,
    boxShadow: scrolled ? SHADOWS.navbar : 'none',
  }),
  inner: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: `0 ${SPACING[6]}`,
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoWrap: {
    display: 'flex', alignItems: 'center', gap: SPACING[2],
    textDecoration: 'none', flexShrink: 0,
  },
  logoIcon: {
    width: '36px', height: '36px',
    background: COLORS.primary,
    borderRadius: RADIUS.card,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: SHADOWS.glowSm,
  },
  logoText: {
    fontSize: FONT.size.lg,
    fontWeight: FONT.weight.bold,
    color: COLORS.textPrimary,
    letterSpacing: '-0.3px',
  },
  logoAccent: { color: COLORS.primaryLight },
  nav: {
    display: 'flex', alignItems: 'center', gap: SPACING[8],
  },
  loginBtn: {
    display: 'inline-flex', alignItems: 'center',
    padding: `${SPACING[2]} ${SPACING[5]}`,
    borderRadius: RADIUS.btn,
    background: COLORS.primary,
    color: COLORS.white,
    fontSize: FONT.size.sm,
    fontWeight: FONT.weight.semibold,
    textDecoration: 'none',
    border: 'none', cursor: 'pointer',
  },
  mobileDrawer: {
    background: 'rgba(5,8,16,0.96)',
    backdropFilter: 'blur(20px)',
    borderTop: `1px solid ${COLORS.border}`,
    padding: `${SPACING[4]} ${SPACING[6]}`,
    display: 'flex', flexDirection: 'column', gap: SPACING[1],
  },
  mobileLink: {
    padding: `${SPACING[3]} 0`,
    fontSize: FONT.size.sm,
    fontWeight: FONT.weight.medium,
    color: COLORS.textSecondary,
    textDecoration: 'none',
    borderBottom: `1px solid ${COLORS.border}`,
    display: 'block',
    transition: 'color 0.2s ease',
  },
  mobileLoginBtn: {
    marginTop: SPACING[4],
    padding: `${SPACING[3]} ${SPACING[5]}`,
    borderRadius: RADIUS.btn,
    background: COLORS.primary,
    color: COLORS.white,
    fontSize: FONT.size.sm,
    fontWeight: FONT.weight.semibold,
    textDecoration: 'none',
    textAlign: 'center',
    display: 'block',
  },
};

export default function Navbar() {
  const [open, setOpen]       = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header style={S.header(scrolled)}>
      <div style={S.inner}>

        {/* Logo */}
        <a href="#home" style={S.logoWrap} className="fg-logo">
          <div style={S.logoIcon} className="fg-logo-icon">
            <Truck size={17} color={COLORS.white} strokeWidth={2} />
          </div>
          <span style={S.logoText}>
            Fleet<span style={S.logoAccent}>Guard</span>
          </span>
        </a>

        {/* Desktop nav — hidden on mobile via inline media workaround using CSS class */}
        <nav style={S.nav} className="fg-desktop-nav">
          {navLinks.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="fg-nav-link"
              style={{
                fontSize: FONT.size.sm,
                fontWeight: FONT.weight.medium,
                color: COLORS.textSecondary,
                textDecoration: 'none',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.color = COLORS.primaryLight}
              onMouseLeave={e => e.currentTarget.style.color = COLORS.textSecondary}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Desktop login */}
        <a
          href="/login"
          style={S.loginBtn}
          className="fg-btn-primary fg-pulse-glow fg-desktop-nav"
        >
          Login
        </a>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="fg-mobile-only"
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: COLORS.textSecondary, padding: SPACING[2],
          }}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div style={S.mobileDrawer} className="fg-mobile-only-block">
          {navLinks.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              style={S.mobileLink}
              onClick={() => setOpen(false)}
              onMouseEnter={e => e.currentTarget.style.color = COLORS.primaryLight}
              onMouseLeave={e => e.currentTarget.style.color = COLORS.textSecondary}
            >
              {label}
            </a>
          ))}
          <a href="/login" style={S.mobileLoginBtn}>Login</a>
        </div>
      )}
    </header>
  );
}
