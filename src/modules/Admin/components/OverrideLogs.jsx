import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const OverrideLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('desc');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ vehicleNumber: '', driver: '', fleetManager: '', overrideReason: '', status: 'Pending' });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.get('/api/admin/override-logs', { params: { search, filter, sort } });
      setLogs(data.logs || []);
    } catch {
      setError('Failed to load override logs.');
    } finally {
      setLoading(false);
    }
  }, [search, filter, sort]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);
    try {
      await axios.post('/api/admin/override-logs', form);
      setShowForm(false);
      setForm({ vehicleNumber: '', driver: '', fleetManager: '', overrideReason: '', status: 'Pending' });
      fetchLogs();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create log.');
    } finally {
      setSubmitting(false);
    }
  };

  const statusClass = (s) => s === 'Approved' ? 'badge success' : s === 'Rejected' ? 'badge danger' : 'badge warning';

  return (
    <section className="card-section">
      <div className="section-heading compact">
        <div>
          <p className="eyebrow">Operations</p>
          <h3>Override Logs</h3>
        </div>
        <button type="button" className="nav-item" onClick={() => setShowForm(!showForm)} style={{ background: '#3b82f6', borderColor: '#3b82f6', color: '#fff' }}>
          + Add Log
        </button>
      </div>

      {showForm && (
        <div style={{ background: '#111827', border: '1px solid #334155', borderRadius: '14px', padding: '20px', margin: '16px 0' }}>
          <h4 style={{ margin: '0 0 16px', color: '#f1f5f9' }}>New Override Log</h4>
          {formError && <p style={{ color: '#fda4af', margin: '0 0 12px' }}>{formError}</p>}
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {[
              { label: 'Vehicle Number', key: 'vehicleNumber' },
              { label: 'Driver', key: 'driver' },
              { label: 'Fleet Manager', key: 'fleetManager' },
            ].map(({ label, key }) => (
              <label key={key} className="filter-pill">
                <span>{label}</span>
                <input type="text" value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} required
                  style={{ background: '#1e293b', color: '#f1f5f9', border: '1px solid #334155', borderRadius: '10px', padding: '8px 10px' }} />
              </label>
            ))}
            <label className="filter-pill">
              <span>Status</span>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                style={{ background: '#1e293b', color: '#f1f5f9', border: '1px solid #334155', borderRadius: '10px', padding: '8px 10px' }}>
                <option>Pending</option><option>Approved</option><option>Rejected</option>
              </select>
            </label>
            <label className="filter-pill" style={{ gridColumn: '1 / -1' }}>
              <span>Override Reason</span>
              <input type="text" value={form.overrideReason} onChange={(e) => setForm({ ...form, overrideReason: e.target.value })} required
                style={{ background: '#1e293b', color: '#f1f5f9', border: '1px solid #334155', borderRadius: '10px', padding: '8px 10px' }} />
            </label>
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px' }}>
              <button type="submit" disabled={submitting} className="nav-item" style={{ background: '#3b82f6', borderColor: '#3b82f6', color: '#fff' }}>
                {submitting ? 'Saving...' : 'Submit'}
              </button>
              <button type="button" className="nav-item" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="filter-row" style={{ marginTop: '12px' }}>
        <label className="filter-pill">
          <span>Filter by status</span>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Pending">Pending</option>
          </select>
        </label>
        <label className="filter-pill">
          <span>Sort</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </label>
        <label className="filter-pill">
          <span>Search</span>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Vehicle or driver"
            style={{ background: '#111827', color: '#f1f5f9', border: '1px solid #334155', borderRadius: '10px', padding: '8px 10px' }} />
        </label>
      </div>

      <div className="table-shell">
        <div className="table-meta"><span>Total: {logs.length} logs</span></div>
        {loading ? (
          <p className="muted">Loading override logs...</p>
        ) : error ? (
          <p className="muted">{error}</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Vehicle Number</th>
                  <th>Driver</th>
                  <th>Fleet Manager</th>
                  <th>Override Reason</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr><td colSpan={7} style={{ textAlign: 'center', color: '#94a3b8' }}>No logs found</td></tr>
                ) : (
                  logs.map((log) => {
                    const dt = new Date(log.createdAt);
                    return (
                      <tr key={log._id}>
                        <td>{log.vehicleNumber}</td>
                        <td>{log.driver}</td>
                        <td>{log.fleetManager}</td>
                        <td>{log.overrideReason}</td>
                        <td>{dt.toLocaleDateString('en-GB')}</td>
                        <td>{dt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</td>
                        <td><span className={statusClass(log.status)}>{log.status}</span></td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

export default OverrideLogs;
