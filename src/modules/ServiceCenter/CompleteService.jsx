import React, { useState } from 'react';
import axios from 'axios';
import styles from './ServiceCenterDashboard.module.css';

const initialForm = {
  vehicle: '',
  mechanic: '',
  totalCost: '',
  nextServiceDue: '',
};

export default function CompleteService() {
  const [formValues, setFormValues] = useState(initialForm);
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
    if (!formValues.mechanic.trim()) nextErrors.mechanic = 'Mechanic is required';
    if (!formValues.totalCost) nextErrors.totalCost = 'Total cost is required';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    try {
      const apiEndpoint = '/api/service-center/extensions/complete';
      await axios.post(apiEndpoint, {
        ...formValues,
        totalCost: Number(formValues.totalCost),
      });
      setStatus('Service marked as completed successfully.');
      setFormValues(initialForm);
      setErrors({});
    } catch (error) {
      setStatus(error.response?.data?.message || 'Unable to complete service.');
    }
  };

  return (
    <>
      <header className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Service Center</p>
          <h1 className={styles.pageTitle}>Complete Service</h1>
          <p className={styles.pageSubtitle}>Confirm the service work and finalize the completed job.</p>
        </div>
      </header>

      <section className={styles.formCard}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGrid}>
            <label className={styles.field}>
              <span>Vehicle</span>
              <input name="vehicle" value={formValues.vehicle} onChange={handleChange} placeholder="Vehicle number" />
              {errors.vehicle && <small className={styles.errorText}>{errors.vehicle}</small>}
            </label>

            <label className={styles.field}>
              <span>Mechanic</span>
              <input name="mechanic" value={formValues.mechanic} onChange={handleChange} placeholder="Mechanic name" />
              {errors.mechanic && <small className={styles.errorText}>{errors.mechanic}</small>}
            </label>

            <label className={styles.field}>
              <span>Total Cost</span>
              <input type="number" name="totalCost" value={formValues.totalCost} onChange={handleChange} />
              {errors.totalCost && <small className={styles.errorText}>{errors.totalCost}</small>}
            </label>

            <label className={styles.field}>
              <span>Next Service Due</span>
              <input name="nextServiceDue" value={formValues.nextServiceDue} onChange={handleChange} placeholder="e.g. 6000 km" />
            </label>
          </div>

          <div className={styles.formActions}>
            <button type="submit" className={styles.primaryButton}>Mark Service Completed</button>
          </div>
          {status && <p className={styles.sectionSubtitle}>{status}</p>}
        </form>
      </section>
    </>
  );
}
