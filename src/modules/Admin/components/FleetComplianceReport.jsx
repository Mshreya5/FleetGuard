const statusClass = (status) => {
  if (status === 'Valid') return 'badge success';
  if (status === 'Expiring Soon') return 'badge warning';
  if (status === 'Expired') return 'badge danger';
  if (status === 'Compliant') return 'badge success';
  return 'badge danger';
};

const FleetComplianceReport = ({ vehicles, searchTerm, loading = false, error = '' }) => {
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
        {loading ? (
          <p className="muted">Loading compliance data from the backend...</p>
        ) : error ? (
          <p className="muted">{error}</p>
        ) : (
          <>
            <div className="table-wrapper compliance-table-view">
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

            <div className="compliance-card-list">
              {vehicles.map((vehicle) => (
                <div key={vehicle.registrationNumber} className="compliance-vehicle-card">
                  <div className="vehicle-reg">{vehicle.registrationNumber}</div>
                  <div className="compliance-row">
                    <span>Insurance</span>
                    <span className={statusClass(vehicle.insurance)}>{vehicle.insurance}</span>
                  </div>
                  <div className="compliance-row">
                    <span>Pollution Certificate</span>
                    <span className={statusClass(vehicle.pollution)}>{vehicle.pollution}</span>
                  </div>
                  <div className="compliance-row">
                    <span>Fitness Certificate</span>
                    <span className={statusClass(vehicle.fitness)}>{vehicle.fitness}</span>
                  </div>
                  <div className="compliance-row">
                    <span>Overall</span>
                    <span className={statusClass(vehicle.overall)}>{vehicle.overall}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default FleetComplianceReport;
