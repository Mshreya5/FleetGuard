import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, ArrowRight, ShieldCheck, Cpu, Zap, Lock } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { COLORS, SHADOWS, RADIUS, FONT, SPACING } from '../tokens';

const publicFeatures = [
  { icon: ShieldCheck, title: 'Compliance Enforcement', desc: 'Prevent non-compliant vehicle dispatch with hard block rules.' },
  { icon: Cpu, title: 'Real-Time Telematics', desc: 'Monitor vehicle maintenance, mileage, and driver readiness.' },
  { icon: Zap, title: 'Predictive Alerts', desc: 'Identify document expiration and maintenance needs before failure.' },
  { icon: Lock, title: 'Audit Trail Security', desc: 'Complete role-authorized logging of all fleet assignments and overrides.' },
];

export default function Home() {
  return (
    <div style={{ background: COLORS.bg, color: COLORS.textPrimary, fontFamily: FONT.family, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <section style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center', overflow: 'hidden', minHeight: '100vh' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url('https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1920&q=80')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.70)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(30,58,95,0.35)' }} />
        <div style={{ position: 'absolute', top: '-160px', left: '-160px', width: '600px', height: '600px', borderRadius: '50%', background: 'rgba(29,78,216,0.15)', filter: 'blur(120px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-160px', right: '-80px', width: '500px', height: '500px', borderRadius: '50%', background: 'rgba(74,144,226,0.10)', filter: 'blur(100px)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 10, maxWidth: '1280px', margin: '0 auto', padding: `96px ${SPACING[6]} ${SPACING[20]}`, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: SPACING[16], alignItems: 'center', width: '100%' }}>

          {/* Left: Hero text */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING[8] }}>
            <div>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: SPACING[2], fontSize: FONT.size.xs, fontWeight: FONT.weight.semibold, color: COLORS.primaryLight, background: 'rgba(74,144,226,0.12)', border: '1px solid rgba(74,144,226,0.3)', padding: `${SPACING[1]} ${SPACING[3]}`, borderRadius: RADIUS.full, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                <Truck size={12} /> Enterprise Fleet Management Platform
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING[3] }}>
              <h1 style={{ fontSize: 'clamp(48px, 7vw, 72px)', fontWeight: FONT.weight.extrabold, lineHeight: 1.1, letterSpacing: '-1px', margin: 0 }}>
                <span style={{ color: COLORS.primaryLight }}>Fleet</span>
                <span style={{ color: COLORS.white }}>Guard</span>
              </h1>
              <p style={{ fontSize: FONT.size.lg, fontWeight: FONT.weight.semibold, color: COLORS.blueSoft, lineHeight: 1.5, margin: 0 }}>
                Fleet Maintenance &amp; Compliance Management System
              </p>
            </div>

            <p style={{ color: COLORS.textSecondary, fontSize: FONT.size.base, lineHeight: 1.75, maxWidth: '440px', margin: 0 }}>
              Make it structurally impossible to miss a compliance deadline. Manage vehicles,
              documents, maintenance, and driver assignments from one unified platform — with hard blocks,
              audit trails, and predictive risk signals built in.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: SPACING[4] }}>
              <Link to="/features" className="fg-btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: SPACING[2], padding: `${SPACING[3]} ${SPACING[8]}`, borderRadius: RADIUS.btn, background: COLORS.primary, color: COLORS.white, fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, textDecoration: 'none', boxShadow: SHADOWS.glowSm }}>
                Explore Features <ArrowRight size={15} />
              </Link>

              <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: SPACING[2], padding: `${SPACING[3]} ${SPACING[8]}`, borderRadius: RADIUS.btn, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: COLORS.white, fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, textDecoration: 'none' }}>
                Get Started
              </Link>
            </div>
          </div>

          {/* Right: Public Overview Card (No protected data, counts, or alerts) */}
          <div className="fg-fade-right" style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div className="fg-float" style={{ width: '100%', maxWidth: '440px', background: 'rgba(13,21,38,0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(37,99,235,0.3)', borderRadius: RADIUS.lg, overflow: 'hidden', boxShadow: '0 8px 40px rgba(37,99,235,0.3)' }}>
              <div style={{ padding: `${SPACING[4]} ${SPACING[5]}`, borderBottom: `1px solid ${COLORS.border}`, background: 'rgba(30,58,95,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: SPACING[2] }}>
                  <div style={{ width: '28px', height: '28px', background: COLORS.primary, borderRadius: RADIUS.btn, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: SHADOWS.glowSm }}>
                    <Truck size={14} color={COLORS.white} strokeWidth={2} />
                  </div>
                  <span style={{ fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, color: COLORS.textPrimary }}>Platform Highlights</span>
                </div>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: FONT.size.xs, fontWeight: FONT.weight.medium, color: COLORS.primaryLight, background: 'rgba(74,144,226,0.1)', border: '1px solid rgba(74,144,226,0.2)', padding: '3px 10px', borderRadius: RADIUS.full }}>
                  Public Portal
                </span>
              </div>

              <div style={{ padding: SPACING[5], display: 'flex', flexDirection: 'column', gap: SPACING[4] }}>
                {publicFeatures.map(({ icon: Icon, title, desc }) => (
                  <div key={title} style={{ display: 'flex', alignItems: 'flex-start', gap: SPACING[3], padding: SPACING[3], background: 'rgba(5,8,16,0.6)', border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.btn }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: RADIUS.btn, background: 'rgba(74,144,226,0.12)', border: '1px solid rgba(74,144,226,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={16} color={COLORS.primaryLight} strokeWidth={2} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, color: COLORS.textPrimary, margin: '0 0 2px 0' }}>{title}</h4>
                      <p style={{ fontSize: FONT.size.xs, color: COLORS.textSecondary, margin: 0, lineHeight: 1.4 }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ padding: `${SPACING[3]} ${SPACING[5]}`, borderTop: `1px solid ${COLORS.border}`, background: 'rgba(30,58,95,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: FONT.size.xs, color: COLORS.textSecondary }}>Secure Enterprise Architecture</span>
                <Link to="/features" style={{ fontSize: FONT.size.xs, fontWeight: FONT.weight.semibold, color: COLORS.primaryLight, textDecoration: 'none' }}>Learn More →</Link>
              </div>
            </div>
          </div>

        </div>

        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '100px', background: 'linear-gradient(to top, #050810, transparent)', pointerEvents: 'none' }} />
      </section>

      <Footer />
    </div>
  );
}
