/**
 * FleetGuard Design Tokens
 * ─────────────────────────────────────────────────────────────
 * Single source of truth for all design decisions.
 * Import this file in any component to stay consistent.
 */

export const COLORS = {
  // ── Brand Blues ──────────────────────────────────────────────
  primary:       '#4A90E2',   // Main CTA blue
  primaryDark:   '#2563EB',   // Hover state for primary
  primaryLight:  '#60A5FA',   // Accent text, highlights
  blueSoft:      '#93C5FD',   // Subtitle text, soft accents
  blueMid:       '#1D4ED8',   // Deep button hover
  blueDeep:      '#1E3A5F',   // Overlay tint on backgrounds
  blueGlow:      '#3B82F6',   // Glow effects

  // ── Backgrounds ──────────────────────────────────────────────
  bg:            '#050810',   // Page background (near black)
  bgAlt:         '#080D18',   // Alternate section background
  card:          '#0D1526',   // Card surface
  cardHover:     '#111D35',   // Card hover surface

  // ── Borders ──────────────────────────────────────────────────
  border:        '#1E2D4A',   // Default border
  borderBlue:    '#2563EB',   // Active / focused border

  // ── Text ─────────────────────────────────────────────────────
  textPrimary:   '#F0F6FF',   // Headings, primary content
  textSecondary: '#94A3B8',   // Body text, descriptions

  // ── Status (dashboard use only) ──────────────────────────────
  success:       '#22C55E',
  warning:       '#F59E0B',
  danger:        '#EF4444',

  // ── Utility ──────────────────────────────────────────────────
  white:         '#FFFFFF',
  transparent:   'transparent',
};

export const SHADOWS = {
  card:      '0 4px 24px rgba(0,0,0,0.5)',
  cardHover: '0 8px 40px rgba(74,144,226,0.25)',
  glowBlue:  '0 0 20px rgba(74,144,226,0.4)',
  glowSm:    '0 0 10px rgba(74,144,226,0.3)',
  navbar:    '0 4px 30px rgba(37,99,235,0.1)',
};

export const RADIUS = {
  btn:  '10px',
  card: '12px',
  lg:   '16px',
  xl:   '20px',
  full: '9999px',
};

export const FONT = {
  family: "'Inter', 'Segoe UI', sans-serif",
  size: {
    xs:  '11px',
    sm:  '13px',
    base:'15px',
    lg:  '18px',
    xl:  '22px',
    '2xl':'28px',
    '3xl':'36px',
    '4xl':'48px',
    '5xl':'60px',
  },
  weight: {
    regular:   400,
    medium:    500,
    semibold:  600,
    bold:      700,
    extrabold: 800,
  },
};

export const SPACING = {
  1:  '4px',
  2:  '8px',
  3:  '12px',
  4:  '16px',
  5:  '20px',
  6:  '24px',
  8:  '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
};
