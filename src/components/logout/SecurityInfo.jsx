import React from 'react';
import { Clock, Key, ShieldCheck, ShieldOff, RefreshCw } from 'lucide-react';

const ITEMS = [
  { icon: Clock,      iconBg: 'rgba(59,130,246,0.12)',  iconColor: '#60a5fa', label: 'Session Timeout',       value: '30 Minutes',   valueColor: '#f1f5f9' },
  { icon: RefreshCw,  iconBg: 'rgba(34,197,94,0.12)',   iconColor: '#22c55e', label: 'Remember Me',           value: 'Enabled',      valueColor: '#22c55e' },
  { icon: Key,        iconBg: 'rgba(245,158,11,0.12)',  iconColor: '#f59e0b', label: 'Last Password Change',  value: '15 Days Ago',  valueColor: '#f59e0b' },
  { icon: ShieldOff,  iconBg: 'rgba(239,68,68,0.12)',   iconColor: '#ef4444', label: 'Two-Factor Auth',       value: 'Disabled',     valueColor: '#ef4444' },
];

export default function SecurityInfo() {
  return (
    <div className="lg-surface">
      <div className="lg-surface-header">
        <div className="lg-surface-title">
          <ShieldCheck size={15} /> Security Information
        </div>
      </div>
      <div className="lg-security-list">
        {ITEMS.map(item => (
          <div key={item.label} className="lg-security-item">
            <div className="lg-security-left">
              <div className="lg-security-icon" style={{ background: item.iconBg }}>
                <item.icon size={14} style={{ color: item.iconColor }} />
              </div>
              <span className="lg-security-key">{item.label}</span>
            </div>
            <span className="lg-security-value" style={{ color: item.valueColor }}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
