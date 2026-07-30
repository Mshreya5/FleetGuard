const expiryStatusClass = (daysRemaining) => {
  if (daysRemaining < 7) return 'badge danger';
  if (daysRemaining <= 15) return 'badge warning';
  return 'badge success';
};

const UpcomingExpiryReport = ({ expiries, searchTerm, selectedFilter, onFilterChange }) => {
  return (
    <section className="card-section">
      <div className="section-heading compact">
        <div>
          <p className="eyebrow">Documents</p>
          <h3>Upcoming Expiry Report</h3>
        </div>
        <p className="muted">Vehicles with compliance documents nearing expiry</p>
      </div>

      <div className="filter-row">
        <label className="filter-pill">
          <span>Filter by document</span>
          <select value={selectedFilter} onChange={(event) => onFilterChange(event.target.value)}>
            <option value="all">All</option>
            <option value="Insurance">Insurance</option>
            <option value="Pollution Certificate">Pollution Certificate</option>
            <option value="Fitness Certificate">Fitness Certificate</option>
          </select>
        </label>
        <span className="muted">Search: {searchTerm || 'All vehicles'}</span>
      </div>

      <div className="table-shell">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Vehicle Registration Number</th>
                <th>Document Type</th>
                <th>Expiry Date</th>
                <th>Days Remaining</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {expiries.map((item) => (
                <tr key={`${item.registrationNumber}-${item.documentType}`}>
                  <td>{item.registrationNumber}</td>
                  <td>{item.documentType}</td>
                  <td>{item.expiryDate}</td>
                  <td>{item.daysRemaining} Days</td>
                  <td><span className={expiryStatusClass(item.daysRemaining)}>{item.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default UpcomingExpiryReport;
