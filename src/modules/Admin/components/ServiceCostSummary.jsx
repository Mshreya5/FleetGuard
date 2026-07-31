import { useState, useEffect } from 'react';
import axios from 'axios';

const ServiceCostSummary = () => {
  const [summary, setSummary] = useState({ totalCost: 0, monthlyCost: 0, avgCostPerVehicle: 0 });
  const [recentRecords, setRecentRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await axios.get('/api/admin/service-cost');
        if (!isMounted) return;
        setSummary(data.summary || {});
        setRecentRecords(data.recentRecords || []);
      } catch {
        if (isMounted) setError('Failed to load service cost data.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, []);

  const statusClass = (status) => {
    if (status === 'Completed') return 'badge success';
    if (status === 'In Progress') return 'badge warning';
    if (status === 'Pending') return 'badge warning';
    return 'badge danger';
  };

  const cards = [
    { title: 'Total Maintenance Cost', value: `₹${summary.totalCost?.toLocaleString('en-IN')}`, detail: 'All time', accent: 'primary' },
    { title: 'Monthly Maintenance Cost', value: `₹${summary.monthlyCost?.toLocaleString('en-IN')}`, detail: 'Current month', accent: 'accent' },
    { title: 'Avg Cost Per Vehicle', value: `₹${summary.avgCostPerVehicle?.toLocaleString('en-IN')}`, detail: 'Per vehicle', accent: 'success' },
  ];

  return (
    <section className="card-section">
      <div className="section-heading compact">
        <div>
          <p className="eyebrow">Maintenance</p>
          <h3>Service Cost Summary</h3>
        </div>
        <p className="muted">Fleet maintenance cost overview</p>
      </div>

      {loading ? (
        <p className="muted">Loading service cost data...</p>
      ) : error ? (
        <p className="muted">{error}</p>
      ) : (
        <>
          <div className="summary-grid" style={{ marginTop: '16px' }}>
            {cards.map((card) => (
              <article key={card.title} className={`summary-card ${card.accent}`}>
                <p>{card.title}</p>
                <h3>{card.value}</h3>
                <span>{card.detail}</span>
              </article>
            ))}
          </div>

          <div className="table-shell" style={{ marginTop: '20px' }}>
            <div className="table-meta">
              <span>Recent Maintenance Records</span>
            </div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Vehicle</th>
                    <th>Service Date</th>
                    <th>Description</th>
                    <th>Service Center</th>
                    <th>Cost</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRecords.length === 0 ? (
                    <tr><td colSpan={6} style={{ textAlign: 'center', color: '#94a3b8' }}>No records found</td></tr>
                  ) : (
                    recentRecords.map((r) => (
                      <tr key={r._id}>
                        <td>{r.vehicle}</td>
                        <td>{new Date(r.serviceDate).toLocaleDateString('en-GB')}</td>
                        <td>{r.description}</td>
                        <td>{r.serviceCenter}</td>
                        <td>₹{r.cost?.toLocaleString('en-IN')}</td>
                        <td><span className={statusClass(r.status)}>{r.status}</span></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default ServiceCostSummary;
