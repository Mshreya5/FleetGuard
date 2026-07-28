import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Mail, Phone, MapPin } from 'lucide-react';
import { COLORS, RADIUS, FONT, SPACING } from '../tokens';

const quickLinks = [
  { label: 'Features', to: '/features' },
  { label: 'About',    to: '/about' },
  { label: 'Contact',  to: '/contact' },
];

const contactInfo = [
  { icon: Mail,   label: 'Email',   value: 'support@fleetguard.io' },
  { icon: Phone,  label: 'Phone',   value: '+1 (800) 555-0199' },
  { icon: MapPin, label: 'Address', value: '123 Fleet Avenue, Austin, TX 78701' },
];

export default function Footer() {
  return (
    <footer style={{ position: 'relative', background: COLORS.bgAlt, borderTop: `1px solid ${COLORS.border}`, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '600px', height: '200px', background: 'rgba(74,144,226,0.07)', filter: 'blur(80px)', pointerEvents: 'none' }} />

      <div style={{
        position: 'relative', zIndex: 10,
        maxWidth: '1280px', margin: '0 auto',
        padding: `${SPACING[16]} ${SPACING[6]} ${SPACING[12]}`,
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: SPACING[10],
      }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING[5], gridColumn: 'span 2' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: SPACING[2], textDecoration: 'none' }}>
            <div style={{ width: '36px', height: '36px', background: COLORS.primary, borderRadius: RADIUS.card, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 10px rgba(74,144,226,0.3)' }}>
              <Truck size={17} color={COLORS.white} strokeWidth={2} />
            </div>
            <span style={{ fontSize: FONT.size.lg, fontWeight: FONT.weight.bold, color: COLORS.textPrimary, letterSpacing: '-0.3px' }}>
              Fleet<span style={{ color: COLORS.primaryLight }}>Guard</span>
            </span>
          </Link>
          <p style={{ fontSize: FONT.size.sm, color: COLORS.textSecondary, lineHeight: 1.7, maxWidth: '280px' }}>
            The all-in-one fleet maintenance and compliance management platform for modern enterprises.
          </p>
          <div style={{ width: '48px', height: '2px', borderRadius: '2px', background: 'rgba(74,144,226,0.5)' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING[4] }}>
          <h4 style={{ fontSize: FONT.size.xs, fontWeight: FONT.weight.semibold, color: COLORS.primaryLight, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Quick Links</h4>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: SPACING[2], listStyle: 'none', padding: 0, margin: 0 }}>
            {quickLinks.map(({ label, to }) => (
              <li key={label}>
                <Link to={to} className="fg-footer-link" style={{ fontSize: FONT.size.sm, color: COLORS.textSecondary, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING[4] }}>
          <h4 style={{ fontSize: FONT.size.xs, fontWeight: FONT.weight.semibold, color: COLORS.primaryLight, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Contact</h4>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: SPACING[3], listStyle: 'none', padding: 0, margin: 0 }}>
            {contactInfo.map(({ icon: Icon, label, value }) => (
              <li key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: SPACING[2] }}>
                <Icon size={14} color={COLORS.primary} style={{ marginTop: '2px', flexShrink: 0 }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: FONT.size.xs, fontWeight: FONT.weight.medium, color: COLORS.textSecondary }}>{label}</span>
                  <span style={{ fontSize: FONT.size.sm, color: COLORS.textSecondary }}>{value}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

      </div>

      <div style={{ position: 'relative', zIndex: 10, borderTop: `1px solid ${COLORS.border}`, padding: `${SPACING[4]} ${SPACING[6]}`, background: 'rgba(5,8,16,0.5)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: SPACING[2] }}>
          <p style={{ fontSize: FONT.size.xs, color: COLORS.textSecondary }}>© 2026 FleetGuard. All rights reserved.</p>
          <div style={{ display: 'flex', gap: SPACING[6] }}>
            {['Privacy Policy', 'Terms of Service'].map((item) => (
              <Link key={item} to="/contact" className="fg-footer-link" style={{ fontSize: FONT.size.xs, color: COLORS.textSecondary, textDecoration: 'none' }}>
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
