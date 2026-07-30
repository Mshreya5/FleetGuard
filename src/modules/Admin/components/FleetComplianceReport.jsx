const statusClass = (status) => {
  if (status === 'Valid') return 'badge success';
  if (status === 'Expiring Soon') return 'badge warning';
  if (status === 'Expired') return 'badge danger';
  if (status === 'Compliant') return 'badge success';
  return 'badge danger';
};

const FleetComplianceReport = ({ vehicles, searchTerm }) => {
  const compliantCount = vehicles.filter((vehicle) => vehicle.overall === 'Compliant').length;
  const expiredInsurance = vehicles.filter((vehicle) => vehicle.insurance === 'Expired').length;
  const expiredPollution = vehicles.filter((vehicle) => vehicle.pollution === 'Expired').length;
  const expiredFitness = vehicles.filter((vehicle) => vehicle.fitness === 'Expired').length;
  const compliancePercentage = Math.round((compliantCount / vehicles.length) * 100) || 0;

  return (
    <section className="card-section">
      <div className="section-heading compact">
        <div>
          <p className="eyebrow">Compliance</p>
          <h3>Fleet Compliance Report</h3>
        </div>
        <p className="muted">Search and review all vehicle compliance records</p>
      </div>

      <div className="compliance-summary-grid">
        <div className="mini-stat">
          <span>Total Compliant Vehicles</span>
          <strong>{compliantCount}</strong>
        </div>
        <div className="mini-stat">
          <span>Expired Insurance</span>
          <strong>{expiredInsurance}</strong>
        </div>
        <div className="mini-stat">
          <span>Expired Pollution</span>
          <strong>{expiredPollution}</strong>
        </div>
        <div className="mini-stat">
          <span>Expired Fitness</span>
          <strong>{expiredFitness}</strong>
        </div>
        <div className="mini-stat">
          <span>Compliance Percentage</span>
          <strong>{compliancePercentage}%</strong>
        </div>
      </div>

      <div className="table-shell">
        <div className="table-meta">
          <span>Showing {vehicles.length} records</span>
          <span>Search: {searchTerm || 'All vehicles'}</span>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Vehicle Registration Number</th>
                <th>Insurance Status</th>
                <th>Pollution Certificate Status</th>
                <th>Fitness Certificate Status</th>
                <th>Overall Compliance Status</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((vehicle) => (
                <tr key={vehicle.registrationNumber}>
                  <td>{vehicle.registrationNumber}</td>
                  <td><span className={statusClass(vehicle.insurance)}>{vehicle.insurance}</span></td>
                  <td><span className={statusClass(vehicle.pollution)}>{vehicle.pollution}</span></td>
                  <td><span className={statusClass(vehicle.fitness)}>{vehicle.fitness}</span></td>
                  <td><span className={statusClass(vehicle.overall)}>{vehicle.overall}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default FleetComplianceReport;
