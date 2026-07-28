import React from 'react';
import { Truck, ShieldCheck, Users, Wrench } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { COLORS, RADIUS, FONT, SPACING } from '../tokens';

const features = [
  {
    icon: Truck,
    title: 'Vehicle Registry',
    description: 'Register and manage fleet vehicles with complete ownership and status records.',
    animClass: 'fg-fade-up',
  },
  {
    icon: ShieldCheck,
    title: 'Compliance Tracking',
    description: 'Track insurance, inspection, and emission certificates with expiry alerts.',
    animClass: 'fg-fade-up-1',
  },
  {
    icon: Users,
    title: 'Driver Assignment',
    description: 'Assign only compliant, roadworthy vehicles to drivers before every trip.',
    animClass: 'fg-fade-up-2',
  },
  {
    icon: Wrench,
    title: 'Maintenance Management',
    description: 'Log maintenance records and monitor service schedules to reduce downtime.',
    animClass: 'fg-fade-up-3',
  },
];

export default function Features() {
  return (
    <div style={{ background: COLORS.bg, color: COLORS.textPrimary, fontFamily: FONT.family, minHeight: '100vh' }}>
      <Navbar />

      <section style={{ position: 'relative', padding: `${SPACING[24]} 0`, paddingTop: '120px', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1920&q=80')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.82)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(8,13,24,0.7)' }} />
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '800px', height: '300px', background: 'rgba(74,144,226,0.08)', filter: 'blur(100px)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 10, maxWidth: '1280px', margin: '0 auto', padding: `0 ${SPACING[6]}` }}>

          <div className="fg-fade-up" style={{ marginBottom: SPACING[12] }}>
            <p style={{ fontSize: FONT.size.xs, fontWeight: FONT.weight.semibold, color: COLORS.primaryLight, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: SPACING[3] }}>Platform Features</p>
            <h1 style={{ fontSize: FONT.size['3xl'], fontWeight: FONT.weight.bold, color: COLORS.textPrimary, lineHeight: 1.2 }}>Everything your fleet needs</h1>
            <div style={{ marginTop: SPACING[4], width: '56px', height: '3px', borderRadius: '2px', background: COLORS.primary }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: SPACING[5] }}>
            {features.map(({ icon: Icon, title, description, animClass }) => (
              <div key={title} className={`fg-feature-card ${animClass}`} style={{
                position: 'relative', background: 'rgba(13,21,38,0.75)',
                backdropFilter: 'blur(8px)', border: `1px solid ${COLORS.border}`,
                borderRadius: RADIUS.lg, padding: SPACING[6],
                display: 'flex', flexDirection: 'column', gap: SPACING[4],
                cursor: 'default', overflow: 'hidden',
              }}>
                <div className="fg-card-top-line" />
                <div className="fg-icon-box" style={{
                  width: '44px', height: '44px', borderRadius: RADIUS.btn,
                  background: 'rgba(74,144,226,0.15)', border: `1px solid rgba(74,144,226,0.2)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, transition: 'background 0.25s ease, box-shadow 0.25s ease',
                }}>
                  <Icon size={22} color={COLORS.primary} strokeWidth={1.8} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING[2] }}>
                  <h3 style={{ fontSize: FONT.size.base, fontWeight: FONT.weight.semibold, color: COLORS.textPrimary }}>{title}</h3>
                  <p style={{ fontSize: FONT.size.sm, color: COLORS.textSecondary, lineHeight: 1.7 }}>{description}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
