import React from 'react';

export default function SessionCard({ icon: Icon, label, value, colorClass, cardClass, badge }) {
  return (
    <div className={`lg-card ${cardClass}`}>
      <div className={`lg-card-icon ${colorClass}`}>
        <Icon size={22} />
      </div>
      <div className="lg-card-info">
        <div className="lg-card-value">{value}</div>
        <div className="lg-card-label">{label}</div>
        {badge && (
          <div className={`lg-card-badge ${badge.color}`}>
            <span className="lg-card-badge-dot" />
            {badge.text}
          </div>
        )}
      </div>
    </div>
  );
}
