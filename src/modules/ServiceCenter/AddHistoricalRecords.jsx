import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './ServiceCenterDashboard.module.css';

const initialForm = {
  vehicle: '',
  date: '',
  description: '',
  cost: '',
};

export default function AddHistoricalRecords() {
  const [formValues, setFormValues] = useState(initialForm);
  const [records, setRecords] = useState([]);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!formValues.vehicle.trim()) nextErrors.vehicle = 'Vehicle is required';
    if (!formValues.date) nextErrors.date = 'Date is required';
    if (!formValues.description.trim()) nextErrors.description = 'Description is required';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const fetchRecords = async () => {
    try {
      const response = await axios.get('/api/service-center/extensions/historical');
      const data = response.data;
      const items = Array.isArray(data) ? data : (data?.records || data?.history || []);
      setRecords(items);
    } catch (error) {
      console.error('Unable to fetch historical records', error);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    try {
      await axios.post('/api/service-center/extensions/history', {
        ...formValues,
        cost: Number(formValues.cost || 0),
        date: new Date(formValues.date).toISOString(),
      });
      setStatus('Historical record saved successfully.');
      setFormValues(initialForm);
      fetchRecords();
    } catch (error) {
      setStatus(error.response?.data?.message || 'Unable to save record.');
    }
  };

  const safeRecords = Array.isArray(records) ? records : [];

  return (
    <>
      <header className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Service Center</p>
          <h1 className={styles.pageTitle}>Add Historical Records</h1>
          <p className={styles.pageSubtitle}>Store prior service entries or historical maintenance notes for a vehicle.</p>
        </div>
      </header>

      <div className={styles.formLayout}>
        <section className={styles.formCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGrid}>
              <label className={styles.field}>
                <span>Vehicle</span>
                <input name="vehicle" value={formValues.vehicle} onChange={handleChange} placeholder="Vehicle number" />
                {errors.vehicle && <small className={styles.errorText}>{errors.vehicle}</small>}
              </label>

              <label className={styles.field}>
                <span>Date</span>
                <input type="date" name="date" value={formValues.date} onChange={handleChange} />
                {errors.date && <small className={styles.errorText}>{errors.date}</small>}
              </label>
            </div>

            <label className={styles.field}>
              <span>Description</span>
              <textarea name="description" rows="4" value={formValues.description} onChange={handleChange} placeholder="Describe the historical service event" />
              {errors.description && <small className={styles.errorText}>{errors.description}</small>}
            </label>

            <label className={styles.field}>
              <span>Cost</span>
              <input type="number" name="cost" value={formValues.cost} onChange={handleChange} />
            </label>

            <div className={styles.formActions}>
              <button type="submit" className={styles.primaryButton}>Save Record</button>
            </div>
            {status && <p className={styles.sectionSubtitle}>{status}</p>}
          </form>
        </section>

        <aside className={styles.formCard}>
          <h2 className={styles.sectionTitle}>Saved Historical Records</h2>
          {safeRecords.length === 0 ? <p className={styles.sectionSubtitle}>No historical records yet.</p> : safeRecords.slice(0, 5).map((record, i) => (
            <div key={record._id || i} className={styles.submissionItem} style={{ marginTop: '8px' }}>
              <strong>{record.vehicle}</strong>
              <span>{record.description}</span>
              <small>{new Date(record.date || record.createdAt).toLocaleDateString()} • ₹{Number(record.cost || 0).toLocaleString()}</small>
            </div>
          ))}
        </aside>
      </div>
    </>
  );
}
