import React from 'react';
import './fleetManager.css';

const DashboardCards = ({ summary, complianceSummary }) => {
  const cards = [
    { label: 'Total Vehicles', value: summary.total, detail: 'Registered fleet units' },
    { label: 'Assigned Vehicles', value: summary.assigned, detail: 'Currently allocated' },
    { label: 'Available Vehicles', value: summary.available, detail: 'Ready for deployment' },
    {
      label: 'Compliance Summary',
      value: `${complianceSummary.valid}`,
      detail: 'Valid fleet units',
      extra: (
        <div className="compliance-list">
          <div className="compliance-row">
            <span>Valid</span>
            <strong>{complianceSummary.valid}</strong>
          </div>
          <div className="compliance-row">
            <span>Expiring Soon</span>
            <strong>{complianceSummary.expiringSoon}</strong>
          </div>
          <div className="compliance-row">
            <span>Expired</span>
            <strong>{complianceSummary.expired}</strong>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="cards-grid">
      {cards.map((card) => (
        <article className="card" key={card.label}>
          <div className="card-label">{card.label}</div>
          <div className="card-value">{card.value}</div>
          <div className="card-detail">{card.detail}</div>
          {card.extra}
        </article>
      ))}
    </div>
  );
};

export default DashboardCards;
