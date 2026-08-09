import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './ServiceCenterDashboard.module.css';

const initialForm = {
  vehicle: '',
  currentMileage: '',
  serviceInterval: '',
  currentServiceDate: '',
  notes: '',
};

export default function NextServiceSchedule() {
  const [formValues, setFormValues] = useState(initialForm);
  const [records, setRecords] = useState([]);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const nextServiceMileage = Number(formValues.currentMileage || 0) + Number(formValues.serviceInterval || 0);
  const nextServiceDate = formValues.currentServiceDate
    ? new Date(new Date(formValues.currentServiceDate).getTime() + Number(formValues.serviceInterval || 0) * 24 * 60 * 60 * 1000)
    : null;

  const validate = () => {
    const nextErrors = {};
    if (!formValues.vehicle.trim()) nextErrors.vehicle = 'Vehicle is required';
    if (!formValues.currentMileage) nextErrors.currentMileage = 'Current mileage is required';
    if (!formValues.serviceInterval) nextErrors.serviceInterval = 'Service interval is required';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const fetchSchedules = async () => {
    try {
      const response = await axios.get('/api/service-center/extensions/schedules');
      const data = response.data;
      const items = Array.isArray(data) ? data : (data?.schedules || []);
      setRecords(items);
    } catch (error) {
      console.error('Unable to fetch service schedules', error);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    try {
      await axios.post('/api/service-center/extensions/schedules', {
        ...formValues,
        currentMileage: Number(formValues.currentMileage),
        serviceInterval: Number(formValues.serviceInterval),
      });
      setStatus('Next service schedule saved.');
      setFormValues(initialForm);
      fetchSchedules();
    } catch (error) {
      setStatus(error.response?.data?.message || 'Unable to save schedule.');
    }
  };

  const safeRecords = Array.isArray(records) ? records : [];

  return (
    <>
      <header className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Service Center</p>
          <h1 className={styles.pageTitle}>Next Service Schedule</h1>
          <p className={styles.pageSubtitle}>Plan the next service visit based on mileage and interval preferences.</p>
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
                <span>Current Mileage</span>
                <input type="number" name="currentMileage" value={formValues.currentMileage} onChange={handleChange} />
                {errors.currentMileage && <small className={styles.errorText}>{errors.currentMileage}</small>}
              </label>

              <label className={styles.field}>
                <span>Service Interval (days)</span>
                <input type="number" name="serviceInterval" value={formValues.serviceInterval} onChange={handleChange} />
                {errors.serviceInterval && <small className={styles.errorText}>{errors.serviceInterval}</small>}
              </label>

              <label className={styles.field}>
                <span>Current Service Date</span>
                <input type="date" name="currentServiceDate" value={formValues.currentServiceDate} onChange={handleChange} />
              </label>
            </div>

            <label className={styles.field}>
              <span>Notes</span>
              <textarea name="notes" rows="3" value={formValues.notes} onChange={handleChange} placeholder="Add scheduling notes" />
            </label>

            <div className={styles.formActions}>
              <button type="submit" className={styles.primaryButton}>Save Schedule</button>
            </div>
            {status && <p className={styles.sectionSubtitle}>{status}</p>}
          </form>
        </section>

        <aside className={styles.formCard}>
          <h2 className={styles.sectionTitle}>Calculated Result</h2>
          <div className={styles.submissionList}>
            <article className={styles.submissionItem}>
              <strong>Next Service Mileage</strong>
              <span>{nextServiceMileage > 0 ? `${nextServiceMileage} km` : '—'}</span>
            </article>
            <article className={styles.submissionItem}>
              <strong>Next Service Date</strong>
              <span>{nextServiceDate ? nextServiceDate.toLocaleDateString() : '—'}</span>
            </article>
            {safeRecords.length > 0 && (
              <div style={{ marginTop: '16px' }}>
                <strong style={{ fontSize: '12px', color: '#94a3b8' }}>Saved Schedules ({safeRecords.length})</strong>
                <ul style={{ paddingLeft: '16px', margin: '8px 0', fontSize: '13px' }}>
                  {safeRecords.slice(0, 5).map((rec, i) => (
                    <li key={rec._id || i}>{rec.vehicle}: {rec.nextServiceMileage ? `${rec.nextServiceMileage} km` : 'Scheduled'}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}
