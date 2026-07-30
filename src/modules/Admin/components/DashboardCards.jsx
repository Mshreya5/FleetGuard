import SummaryCard from './SummaryCard';

const DashboardCards = ({ summary }) => {
  const cards = [
    { title: 'Total Vehicles', value: summary.totalVehicles, detail: 'Fleet inventory', accent: 'primary' },
    { title: 'Total Drivers', value: summary.totalDrivers, detail: 'Assigned operators', accent: 'accent' },
    { title: 'Fleet Managers', value: summary.fleetManagers, detail: 'Supervisory team', accent: 'success' },
    { title: 'Vehicles Under Maintenance', value: summary.vehiclesUnderMaintenance, detail: 'In-service hold', accent: 'danger' },
  ];

  return (
    <div className="summary-grid">
      {cards.map((card) => (
        <SummaryCard key={card.title} {...card} />
      ))}
    </div>
  );
};

export default DashboardCards;
