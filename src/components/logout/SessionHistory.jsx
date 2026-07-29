import React from 'react';
import { LogIn, LayoutDashboard, Bell, Shield, LogOut } from 'lucide-react';

const HISTORY = [
  { icon: LogIn,          type: 'success', action: 'Logged In',              time: 'Today, 09:30 AM' },
  { icon: LayoutDashboard,type: 'info',    action: 'Viewed Dashboard',        time: 'Today, 09:32 AM' },
  { icon: Bell,           type: 'info',    action: 'Opened Notifications',    time: 'Today, 09:45 AM' },
  { icon: Shield,         type: 'warning', action: 'Viewed Audit Logs',       time: 'Today, 10:04 AM' },
  { icon: LogOut,         type: 'danger',  action: 'Logout Initiated',        time: 'Today, 10:15 AM' },
];

export default function SessionHistory() {
  return (
    <div className="lg-surface">
      <div className="lg-surface-header">
        <div className="lg-surface-title">
          <Shield size={15} /> Session History
        </div>
      </div>
      <div className="lg-timeline">
        {HISTORY.map((item, i) => (
          <div key={i} className="lg-tl-item">
            <div className="lg-tl-line">
              <div className={`lg-tl-dot ${item.type}`}><item.icon size={13} /></div>
              {i < HISTORY.length - 1 && <div className="lg-tl-connector" />}
            </div>
            <div className="lg-tl-body">
              <div className="lg-tl-action">{item.action}</div>
              <div className="lg-tl-time">{item.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
