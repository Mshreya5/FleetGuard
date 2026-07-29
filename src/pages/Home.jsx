import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, FileText, Wrench, Users, BarChart2, Bell, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { COLORS, SHADOWS, RADIUS, FONT, SPACING } from '../tokens';

const metrics = [
  { icon: Truck, label: 'Vehicles', value: '120' },
  { icon: FileText, label: 'Documents', value: '340' },
  { icon: Wrench, label: 'Scheduled', value: '28' },
  { icon: Users, label: 'Drivers', value: '45' },
  { icon: BarChart2, label: 'Reports', value: '18' },
  { icon: Bell, label: 'Alerts', value: '6' },
];

const stats = [
  { value: '500+', label: 'Fleets Managed' },
  { value: '99%', label: 'Uptime' },
  { value: '50+', label: 'Enterprises' },
  { value: '0', label: 'Missed Expirations' },
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING[8] }}>
            <div>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: SPACING[2], fontSize: FONT.size.xs, fontWeight: FONT.weight.semibold, color: COLORS.primaryLight, background: 'rgba(74,144,226,0.12)', border: '1px solid rgba(74,144,226,0.3)', padding: `${SPACING[1]} ${SPACING[3]}`, borderRadius: RADIUS.full, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                <Truck size={12} /> Fleet Management Platform
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
              documents, maintenance, and driver assignments from one platform — with hard blocks,
              audit trails, and predictive risk signals built in.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: SPACING[3] }}>
              <Link to="/features" className="fg-btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: SPACING[2], padding: `${SPACING[3]} ${SPACING[8]}`, borderRadius: RADIUS.btn, background: COLORS.primary, color: COLORS.white, fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, textDecoration: 'none', boxShadow: SHADOWS.glowSm }}>
                Explore Features <ArrowRight size={15} />
              </Link>
            </div>

            <div style={{ display: 'flex', gap: SPACING[10], paddingTop: SPACING[6], borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              {stats.map(({ value, label }) => (
                <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: FONT.size['2xl'], fontWeight: FONT.weight.bold, color: COLORS.primaryLight }}>{value}</span>
                  <span style={{ fontSize: FONT.size.xs, color: COLORS.textSecondary }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ width: '100%', maxWidth: '420px', background: 'rgba(13,21,38,0.82)', backdropFilter: 'blur(20px)', border: '1px solid rgba(37,99,235,0.3)', borderRadius: RADIUS.lg, overflow: 'hidden', boxShadow: '0 8px 40px rgba(37,99,235,0.3)' }}>
              <div style={{ padding: `${SPACING[4]} ${SPACING[5]}`, borderBottom: `1px solid ${COLORS.border}`, background: 'rgba(30,58,95,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: SPACING[2] }}>
                  <div style={{ width: '28px', height: '28px', background: COLORS.primary, borderRadius: RADIUS.btn, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: SHADOWS.glowSm }}>
                    <Truck size={14} color={COLORS.white} strokeWidth={2} />
                  </div>
                  <span style={{ fontSize: FONT.size.sm, fontWeight: FONT.weight.semibold, color: COLORS.textPrimary }}>Fleet Overview</span>
                </div>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: FONT.size.xs, fontWeight: FONT.weight.medium, color: COLORS.primaryLight, background: 'rgba(74,144,226,0.1)', border: '1px solid rgba(74,144,226,0.2)', padding: '3px 10px', borderRadius: RADIUS.full }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: COLORS.primaryLight }} />
                  Live
                </span>
              </div>

              <div style={{ padding: `${SPACING[4]} ${SPACING[5]} ${SPACING[2]}` }}>
                <p style={{ fontSize: FONT.size.xs, fontWeight: FONT.weight.semibold, color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Module Summary</p>
              </div>

              <div style={{ padding: `0 ${SPACING[5]} ${SPACING[5]}`, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: SPACING[3] }}>
                {metrics.map(({ icon: Icon, label, value }) => (
                  <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', padding: SPACING[3], background: 'rgba(5,8,16,0.6)', border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.btn, cursor: 'default' }}>
                    <Icon size={16} color={COLORS.primary} strokeWidth={1.8} />
                    <span style={{ fontSize: FONT.size.lg, fontWeight: FONT.weight.bold, color: COLORS.textPrimary }}>{value}</span>
                    <span style={{ fontSize: FONT.size.xs, color: COLORS.textSecondary }}>{label}</span>
                  </div>
                ))}
              </div>

              <div style={{ padding: `${SPACING[3]} ${SPACING[5]}`, borderTop: `1px solid ${COLORS.border}`, background: 'rgba(30,58,95,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: FONT.size.xs, color: COLORS.textSecondary }}>Last synced: just now</span>
                <Link to="/features" style={{ fontSize: FONT.size.xs, fontWeight: FONT.weight.semibold, color: COLORS.primaryLight, textDecoration: 'none' }}>View All →</Link>
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
