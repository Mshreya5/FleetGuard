import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { COLORS, SHADOWS, RADIUS, FONT, SPACING } from '../tokens';

const points = [
  'Centralized vehicle and document management',
  'Automated compliance expiry alerts',
  'Safe and verified driver assignments',
  'Proactive maintenance scheduling',
  'Reduced operational and regulatory risk',
  'Designed for enterprise fleet operations',
];

export default function About() {
  return (
    <div style={{ background: COLORS.bg, color: COLORS.textPrimary, fontFamily: FONT.family, minHeight: '100vh' }}>
      <Navbar />

      <section style={{ position: 'relative', padding: `${SPACING[24]} 0`, paddingTop: '120px', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url('https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1920&q=80')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.76)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(5,8,16,0.6)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '500px', height: '400px', borderRadius: '50%', background: 'rgba(29,78,216,0.13)', filter: 'blur(120px)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 10, maxWidth: '1280px', margin: '0 auto', padding: `0 ${SPACING[6]}`, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: SPACING[16], alignItems: 'start' }}>

          <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING[6] }}>
            <div>
              <p style={{ fontSize: FONT.size.xs, fontWeight: FONT.weight.semibold, color: COLORS.primaryLight, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: SPACING[3] }}>About FleetGuard</p>
              <h1 style={{ fontSize: FONT.size['3xl'], fontWeight: FONT.weight.bold, color: COLORS.textPrimary, lineHeight: 1.25 }}>
                Built for enterprise{' '}
                <span style={{ color: COLORS.primaryLight }}>fleet operations</span>
              </h1>
              <div style={{ marginTop: SPACING[4], width: '56px', height: '3px', borderRadius: '2px', background: COLORS.primary }} />
            </div>

            <p style={{ color: COLORS.textSecondary, fontSize: FONT.size.base, lineHeight: 1.75 }}>
              FleetGuard is an enterprise fleet management system designed to improve
              operational efficiency and compliance. It provides organizations with a
              single platform to manage vehicle registrations, track compliance
              documents, schedule maintenance, and assign drivers — reducing risk and
              ensuring every vehicle on the road meets regulatory standards.
            </p>
            <p style={{ color: COLORS.textSecondary, fontSize: FONT.size.base, lineHeight: 1.75 }}>
              Built for fleet managers, compliance officers, and logistics teams who
              need reliable, real-time visibility across their entire vehicle ecosystem.
            </p>

            <Link to="/features" className="fg-btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: SPACING[2], width: 'fit-content', padding: `${SPACING[3]} ${SPACING[6]}`, borderRadius: RADIUS.btn, background: COLORS.primary, color: COLORS.white, fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, textDecoration: 'none', boxShadow: SHADOWS.glowSm }}>
              Explore Features <ArrowRight size={15} />
            </Link>
          </div>

          <div style={{ background: 'rgba(13,21,38,0.75)', backdropFilter: 'blur(20px)', border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.lg, padding: SPACING[8], boxShadow: '0 8px 40px rgba(37,99,235,0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: SPACING[3], marginBottom: SPACING[6] }}>
              <div style={{ width: '4px', height: '24px', borderRadius: '2px', background: COLORS.primary }} />
              <p style={{ fontSize: FONT.size.xs, fontWeight: FONT.weight.semibold, color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Key Benefits</p>
            </div>

            <ul style={{ display: 'flex', flexDirection: 'column', gap: '4px', listStyle: 'none', padding: 0, margin: 0 }}>
              {points.map((point) => (
                <li key={point} style={{ display: 'flex', alignItems: 'center', gap: SPACING[3], padding: `${SPACING[3]} ${SPACING[3]}`, borderRadius: '0 8px 8px 0', cursor: 'default' }}>
                  <CheckCircle2 size={16} color={COLORS.primary} strokeWidth={2} style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: FONT.size.sm, color: COLORS.textSecondary, lineHeight: 1.6 }}>{point}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
