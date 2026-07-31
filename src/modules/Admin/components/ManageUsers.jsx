import { useState, useEffect } from 'react';
import axios from 'axios';

const ROLES = ['Admin', 'Fleet Manager', 'Driver', 'Service Center'];
const BRANCHES = ['Head Office', 'Bangalore', 'Chennai', 'Mumbai', 'Kochi', 'Hyderabad', 'Ahmedabad', 'Ludhiana', 'Jaipur', 'Lucknow', 'Gurugram', 'Delhi', 'Kolkata', 'Bhubaneswar', 'Bhopal', 'Panaji'];

const emptyForm = { name: '', email: '', password: '', role: 'Driver', branch: 'Head Office', phone: '' };

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.get('/api/users');
      setUsers(data.users || []);
    } catch {
      setError('Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const openAdd = () => { setEditingUser(null); setForm(emptyForm); setFormError(''); setShowForm(true); };
  const openEdit = (user) => {
    setEditingUser(user);
    setForm({ name: user.name, email: user.email, password: '', role: user.role, branch: user.branch, phone: user.phone || '' });
    setFormError('');
    setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setEditingUser(null); setForm(emptyForm); setFormError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);
    try {
      if (editingUser) {
        const payload = { name: form.name, email: form.email, role: form.role, branch: form.branch, phone: form.phone };
        await axios.put(`/api/users/${editingUser._id}`, payload);
      } else {
        await axios.post('/api/users', form);
      }
      closeForm();
      fetchUsers();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Operation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await axios.delete(`/api/users/${id}`);
      fetchUsers();
    } catch {
      alert('Failed to delete user.');
    }
  };

  const handleStatusToggle = async (user) => {
    const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
    try {
      await axios.patch(`/api/users/status/${user._id}`, { status: newStatus });
      fetchUsers();
    } catch {
      alert('Failed to update status.');
    }
  };

  return (
    <section className="card-section">
      <div className="section-heading compact">
        <div>
          <p className="eyebrow">Users</p>
          <h3>Manage User Accounts</h3>
        </div>
        <button className="nav-item" type="button" onClick={openAdd} style={{ background: '#3b82f6', borderColor: '#3b82f6', color: '#fff' }}>
          + Add User
        </button>
      </div>

      {showForm && (
        <div style={{ background: '#111827', border: '1px solid #334155', borderRadius: '14px', padding: '20px', margin: '16px 0' }}>
          <h4 style={{ margin: '0 0 16px', color: '#f1f5f9' }}>{editingUser ? 'Edit User' : 'Add New User'}</h4>
          {formError && <p className="muted" style={{ color: '#fda4af', marginBottom: '12px' }}>{formError}</p>}
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {[
              { label: 'Name', key: 'name', type: 'text', required: true },
              { label: 'Email', key: 'email', type: 'email', required: true },
              { label: 'Phone', key: 'phone', type: 'text', required: false },
              ...(!editingUser ? [{ label: 'Password', key: 'password', type: 'password', required: true }] : []),
            ].map(({ label, key, type, required }) => (
              <label key={key} className="filter-pill">
                <span>{label}</span>
                <input
                  type={type}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  required={required}
                  style={{ background: '#1e293b', color: '#f1f5f9', border: '1px solid #334155', borderRadius: '10px', padding: '8px 10px' }}
                />
              </label>
            ))}
            <label className="filter-pill">
              <span>Role</span>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} style={{ background: '#1e293b', color: '#f1f5f9', border: '1px solid #334155', borderRadius: '10px', padding: '8px 10px' }}>
                {ROLES.map((r) => <option key={r}>{r}</option>)}
              </select>
            </label>
            <label className="filter-pill">
              <span>Branch</span>
              <select value={form.branch} onChange={(e) => setForm({ ...form, branch: e.target.value })} style={{ background: '#1e293b', color: '#f1f5f9', border: '1px solid #334155', borderRadius: '10px', padding: '8px 10px' }}>
                {BRANCHES.map((b) => <option key={b}>{b}</option>)}
              </select>
            </label>
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px', marginTop: '4px' }}>
              <button type="submit" disabled={submitting} className="nav-item" style={{ background: '#3b82f6', borderColor: '#3b82f6', color: '#fff' }}>
                {submitting ? 'Saving...' : editingUser ? 'Update User' : 'Create User'}
              </button>
              <button type="button" className="nav-item" onClick={closeForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="table-shell">
        <div className="table-meta"><span>Total Users: {users.length}</span></div>
        {loading ? (
          <p className="muted">Loading users...</p>
        ) : error ? (
          <p className="muted">{error}</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Branch</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr><td colSpan={7} style={{ textAlign: 'center', color: '#94a3b8' }}>No users found</td></tr>
                ) : (
                  users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>{user.branch}</td>
                      <td>{user.phone || '—'}</td>
                      <td>
                        <span className={user.status === 'Active' ? 'badge success' : 'badge danger'}>
                          {user.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button type="button" className="nav-item" style={{ padding: '4px 10px', fontSize: '0.8rem' }} onClick={() => openEdit(user)}>Edit</button>
                          <button type="button" className="nav-item" style={{ padding: '4px 10px', fontSize: '0.8rem' }} onClick={() => handleStatusToggle(user)}>
                            {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                          </button>
                          <button type="button" className="nav-item" style={{ padding: '4px 10px', fontSize: '0.8rem', borderColor: '#ef4444', color: '#fda4af' }} onClick={() => handleDelete(user._id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

export default ManageUsers;
