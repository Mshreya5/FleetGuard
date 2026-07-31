import React, { useState } from 'react';
import axios from 'axios';
import styles from './ServiceCenterDashboard.module.css';

const initialForm = {
  vehicle: '',
  currentMileage: '',
  updatedMileage: '',
  notes: '',
};

export default function UpdateVehicleMileage() {
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
    if (!formValues.currentMileage) nextErrors.currentMileage = 'Current mileage is required';
    if (!formValues.updatedMileage) nextErrors.updatedMileage = 'Updated mileage is required';
    if (Number(formValues.updatedMileage) <= Number(formValues.currentMileage)) {
      nextErrors.updatedMileage = 'Updated mileage must be greater than current mileage';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    try {
      await axios.post('http://localhost:5000/api/service-center/extensions/mileage', {
        ...formValues,
        currentMileage: Number(formValues.currentMileage),
        updatedMileage: Number(formValues.updatedMileage),
      });
      setStatus('Mileage updated successfully.');
      setFormValues(initialForm);
      setErrors({});
    } catch (error) {
      setStatus(error.response?.data?.message || 'Unable to update mileage.');
    }
  };

  return (
    <>
      <header className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Service Center</p>
          <h1 className={styles.pageTitle}>Update Vehicle Mileage</h1>
          <p className={styles.pageSubtitle}>Record a mileage update and keep the vehicle service profile current.</p>
        </div>
      </header>

      <section className={styles.formCard}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGrid}>
            <label className={styles.field}>
              <span>Vehicle</span>
              <input name="vehicle" value={formValues.vehicle} onChange={handleChange} placeholder="Enter vehicle number" />
              {errors.vehicle && <small className={styles.errorText}>{errors.vehicle}</small>}
            </label>

            <label className={styles.field}>
              <span>Current Mileage</span>
              <input type="number" name="currentMileage" value={formValues.currentMileage} onChange={handleChange} />
              {errors.currentMileage && <small className={styles.errorText}>{errors.currentMileage}</small>}
            </label>

            <label className={styles.field}>
              <span>Updated Mileage</span>
              <input type="number" name="updatedMileage" value={formValues.updatedMileage} onChange={handleChange} />
              {errors.updatedMileage && <small className={styles.errorText}>{errors.updatedMileage}</small>}
            </label>
          </div>

          <label className={styles.field}>
            <span>Notes</span>
            <textarea name="notes" rows="3" value={formValues.notes} onChange={handleChange} placeholder="Add any notes about the mileage update" />
          </label>

          <div className={styles.formActions}>
            <button type="submit" className={styles.primaryButton}>Save Update</button>
          </div>

          {status && <p className={styles.sectionSubtitle}>{status}</p>}
        </form>
      </section>
    </>
  );
}
