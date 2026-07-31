import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const OverdueComplianceReport = () => {
  const [records, setRecords] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.get('/api/admin/overdue', {
        params: { search, filter, page, limit: 10 },
      });
      setRecords(data.records || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch {
      setError('Failed to load overdue compliance data.');
    } finally {
      setLoading(false);
    }
  }, [search, filter, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <section className="card-section">
      <div className="section-heading compact">
        <div>
          <p className="eyebrow">Compliance</p>
          <h3>Overdue Compliance Report</h3>
        </div>
        <p className="muted">Vehicles with expired compliance documents</p>
      </div>

      <div className="filter-row">
        <label className="filter-pill">
          <span>Filter by document</span>
          <select value={filter} onChange={(e) => { setFilter(e.target.value); setPage(1); }}>
            <option value="all">All</option>
            <option value="Insurance">Insurance</option>
            <option value="Pollution Certificate">Pollution Certificate</option>
            <option value="Fitness Certificate">Fitness Certificate</option>
          </select>
        </label>
        <label className="filter-pill">
          <span>Search</span>
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Registration number"
            style={{ background: '#111827', color: '#f1f5f9', border: '1px solid #334155', borderRadius: '10px', padding: '8px 10px' }}
          />
        </label>
      </div>

      <div className="table-shell">
        <div className="table-meta">
          <span>Showing {records.length} of {total} records</span>
          <span>Page {page} of {totalPages}</span>
        </div>
        {loading ? (
          <p className="muted">Loading overdue compliance data...</p>
        ) : error ? (
          <p className="muted">{error}</p>
        ) : (
          <>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Vehicle Number</th>
                    <th>Model</th>
                    <th>Branch</th>
                    <th>Document Type</th>
                    <th>Expiry Date</th>
                    <th>Overdue Days</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {records.length === 0 ? (
                    <tr><td colSpan={7} style={{ textAlign: 'center', color: '#94a3b8' }}>No overdue records found</td></tr>
                  ) : (
                    records.map((r) => (
                      <tr key={`${r.registrationNumber}-${r.documentType}`}>
                        <td>{r.registrationNumber}</td>
                        <td>{r.model}</td>
                        <td>{r.branch}</td>
                        <td>{r.documentType}</td>
                        <td>{r.expiryDate}</td>
                        <td>{r.overdueDays} days</td>
                        <td><span className="badge danger">{r.currentStatus}</span></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="filter-row" style={{ marginTop: '12px' }}>
                <button
                  className="nav-item"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  type="button"
                >
                  Previous
                </button>
                <button
                  className="nav-item"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  type="button"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default OverdueComplianceReport;
