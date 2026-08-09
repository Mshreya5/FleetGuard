import { useState, useEffect } from 'react';
import axios from 'axios';

const FleetSummaryReport = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [generated, setGenerated] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchReport = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await axios.get('/api/admin/report');
        if (isMounted) setReport(data.report);
      } catch {
        if (isMounted) setError('Failed to load fleet report.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchReport();
    return () => { isMounted = false; };
  }, []);

  const generateCSVContent = () => {
    if (!report) return '';

    let csv = 'FLEETGUARD - FLEET SUMMARY REPORT\n';
    csv += `Generated: ${new Date().toLocaleString('en-IN')}\n\n`;

    // Summary Statistics
    csv += 'FLEET STATISTICS\n';
    csv += `Total Vehicles,${report.totalVehicles}\n`;
    csv += `Active Vehicles,${report.activeVehicles}\n`;
    csv += `Inactive Vehicles,${report.inactiveVehicles}\n`;
    csv += `Total Fleet Managers,${report.users}\n\n`;

    // Compliance Summary
    csv += 'COMPLIANCE SUMMARY\n';
    csv += `Compliant Vehicles,${report.complianceSummary.compliant}\n`;
    csv += `Non-Compliant Vehicles,${report.complianceSummary.nonCompliant}\n`;
    csv += `Compliance Rate,${report.complianceSummary.complianceRate}%\n\n`;

    // Service Cost Summary
    csv += 'SERVICE & MAINTENANCE SUMMARY\n';
    csv += `Total Maintenance Records,${report.serviceCosts.records}\n`;
    csv += `Total Service Cost,₹${report.serviceCosts.total?.toLocaleString('en-IN') || 0}\n\n`;

    // Vehicle Details Table
    csv += 'VEHICLE DETAILS\n';
    csv += 'Registration Number,Driver,Fleet Manager,Branch,Status\n';
    (report.assignments || []).forEach((a) => {
      csv += `"${a.registrationNumber}","${a.driver}","${a.fleetManager}","${a.branch}","${a.status}"\n`;
    });

    return csv;
  };

  const handleGenerateReport = async () => {
    try {
      setDownloading(true);
      
      // Generate CSV content
      const csvContent = generateCSVContent();
      
      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `FleetGuard_Summary_Report_${new Date().getTime()}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setGenerated(true);
      setTimeout(() => setGenerated(false), 3000);
    } catch (err) {
      console.error('Error downloading report:', err);
      setError('Failed to download report. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <section className="card-section">
      <div className="section-heading compact">
        <div>
          <p className="eyebrow">Reports</p>
          <h3>Fleet Summary Report</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
          <button type="button" className="nav-item" onClick={handleGenerateReport} disabled={!report || downloading} style={{ background: '#3b82f6', borderColor: '#3b82f6', color: '#fff' }}>
            {downloading ? 'Downloading...' : 'Generate Report'}
          </button>
          {generated && <span style={{ fontSize: '0.8rem', color: '#22c55e' }}>✓ Report downloaded successfully!</span>}
        </div>
      </div>

      {loading ? (
        <p className="muted">Generating fleet report...</p>
      ) : error ? (
        <p className="muted">{error}</p>
      ) : report && (
        <>
          <div className="summary-grid" style={{ marginTop: '16px' }}>
            {[
              { title: 'Total Vehicles', value: report.totalVehicles, accent: 'primary' },
              { title: 'Active Vehicles', value: report.activeVehicles, accent: 'success' },
              { title: 'Inactive Vehicles', value: report.inactiveVehicles, accent: 'danger' },
              { title: 'Total Users', value: report.users, accent: 'accent' },
            ].map((card) => (
              <article key={card.title} className={`summary-card ${card.accent}`}>
                <p>{card.title}</p>
                <h3>{card.value}</h3>
              </article>
            ))}
          </div>

          <div className="compliance-summary-grid" style={{ marginTop: '16px' }}>
            {[
              { label: 'Compliant Vehicles', value: report.complianceSummary.compliant },
              { label: 'Non-Compliant', value: report.complianceSummary.nonCompliant },
              { label: 'Compliance Rate', value: `${report.complianceSummary.complianceRate}%` },
              { label: 'Maintenance Records', value: report.serviceCosts.records },
              { label: 'Total Service Cost', value: `₹${report.serviceCosts.total?.toLocaleString('en-IN')}` },
            ].map(({ label, value }) => (
              <div key={label} className="mini-stat">
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>

          <div className="table-shell" style={{ marginTop: '20px' }}>
            <div className="table-meta"><span>Vehicle Assignments ({report.assignments.length})</span></div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Registration Number</th>
                    <th>Driver</th>
                    <th>Fleet Manager</th>
                    <th>Branch</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(report?.assignments || []).map((a) => (
                    <tr key={a.registrationNumber}>
                      <td>{a.registrationNumber}</td>
                      <td>{a.driver}</td>
                      <td>{a.fleetManager}</td>
                      <td>{a.branch}</td>
                      <td><span className={a.status === 'Active' ? 'badge success' : 'badge danger'}>{a.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default FleetSummaryReport;
