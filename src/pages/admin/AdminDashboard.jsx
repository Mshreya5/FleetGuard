import React from 'react';

export default function AdminDashboard() {
  return (
    <div style={{ minHeight: '100vh', background: '#0F172A', color: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '18px', padding: '28px', maxWidth: '560px', width: '100%' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '12px' }}>Admin Dashboard</h1>
        <p style={{ color: '#94A3B8', lineHeight: 1.6 }}>FleetGuard administration is available through the existing role flow. This module remains intact while the Driver workflow is implemented separately.</p>
      </div>
    </div>
  );
}
