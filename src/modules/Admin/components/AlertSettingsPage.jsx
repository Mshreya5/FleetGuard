import { useState, useEffect } from 'react';
import axios from 'axios';

const AlertSettingsPage = () => {
  const [settings, setSettings] = useState({ thirtyDays: true, fifteenDays: true, sevenDays: true, customDays: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get('/api/admin/alert-settings');
        if (isMounted) setSettings(data.settings);
      } catch {
        if (isMounted) setError('Failed to load alert settings.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchSettings();
    return () => { isMounted = false; };
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    setError('');
    try {
      await axios.put('/api/admin/alert-settings', settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  const toggleRow = [
    { label: '30 Days Alert', key: 'thirtyDays', description: 'Notify 30 days before document expiry' },
    { label: '15 Days Alert', key: 'fifteenDays', description: 'Notify 15 days before document expiry' },
    { label: '7 Days Alert', key: 'sevenDays', description: 'Notify 7 days before document expiry' },
  ];

  return (
    <section className="card-section">
      <div className="section-heading compact">
        <div>
          <p className="eyebrow">Configuration</p>
          <h3>Configure Alert Days</h3>
        </div>
        <p className="muted">Set notification thresholds for document expiry alerts</p>
      </div>

      {loading ? (
        <p className="muted">Loading alert settings...</p>
      ) : error ? (
        <p className="muted">{error}</p>
      ) : (
        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {toggleRow.map(({ label, key, description }) => (
            <div key={key} style={{ background: '#111827', border: '1px solid #334155', borderRadius: '14px', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ margin: 0, fontWeight: 600, color: '#f1f5f9' }}>{label}</p>
                <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '0.88rem' }}>{description}</p>
              </div>
              <button
                type="button"
                onClick={() => setSettings({ ...settings, [key]: !settings[key] })}
                style={{
                  width: '52px', height: '28px', borderRadius: '999px', border: 'none', cursor: 'pointer',
                  background: settings[key] ? '#3b82f6' : '#334155',
                  transition: 'background 0.2s',
                  position: 'relative',
                }}
                aria-label={`Toggle ${label}`}
              >
                <span style={{
                  position: 'absolute', top: '4px', width: '20px', height: '20px', borderRadius: '50%',
                  background: '#fff', transition: 'left 0.2s',
                  left: settings[key] ? '28px' : '4px',
                }} />
              </button>
            </div>
          ))}

          <div style={{ background: '#111827', border: '1px solid #334155', borderRadius: '14px', padding: '16px 20px' }}>
            <p style={{ margin: '0 0 10px', fontWeight: 600, color: '#f1f5f9' }}>Custom Alert Days</p>
            <p style={{ margin: '0 0 12px', color: '#94a3b8', fontSize: '0.88rem' }}>Set a custom number of days for additional alerts (0 = disabled)</p>
            <input
              type="number"
              min={0}
              value={settings.customDays}
              onChange={(e) => setSettings({ ...settings, customDays: parseInt(e.target.value) || 0 })}
              style={{ background: '#1e293b', color: '#f1f5f9', border: '1px solid #334155', borderRadius: '10px', padding: '8px 12px', width: '120px' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button type="button" onClick={handleSave} disabled={saving} className="nav-item"
              style={{ background: '#3b82f6', borderColor: '#3b82f6', color: '#fff', padding: '10px 24px' }}>
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
            {saved && <span style={{ color: '#86efac', fontSize: '0.9rem' }}>✓ Settings saved successfully</span>}
          </div>
        </div>
      )}
    </section>
  );
};

export default AlertSettingsPage;
