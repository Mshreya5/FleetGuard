import React, { useState } from 'react';
import styles from './ServiceCenterDashboard.module.css';

const initialForm = {
  vehicle: '',
  serviceDate: '',
  mechanicName: '',
  serviceType: '',
  partsReplaced: '',
  description: '',
  notes: '',
};

export default function ServiceLogForm() {
  const [formValues, setFormValues] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submittedLogs, setSubmittedLogs] = useState([]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const nextErrors = {};

    Object.entries(formValues).forEach(([key, value]) => {
      if (!String(value).trim()) {
        nextErrors[key] = 'This field is required';
      }
    });

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setSubmittedLogs((prev) => [
      {
        id: Date.now(),
        vehicle: formValues.vehicle,
        serviceDate: formValues.serviceDate,
        mechanicName: formValues.mechanicName,
        serviceType: formValues.serviceType,
      },
      ...prev,
    ].slice(0, 4));

    setFormValues(initialForm);
  };

  const handleCancel = () => {
    setFormValues(initialForm);
    setErrors({});
  };

  return (
    <>
      <header className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Service Center</p>
          <h1 className={styles.pageTitle}>Service Log Form</h1>
          <p className={styles.pageSubtitle}>Record the work completed for each vehicle and keep a clear service history.</p>
        </div>
      </header>

      <div className={styles.formLayout}>
        <section className={styles.formCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGrid}>
              <label className={styles.field}>
                <span>Vehicle</span>
                <input name="vehicle" value={formValues.vehicle} onChange={handleChange} placeholder="Enter vehicle number" />
                {errors.vehicle && <small className={styles.errorText}>{errors.vehicle}</small>}
              </label>

              <label className={styles.field}>
                <span>Service Date</span>
                <input type="date" name="serviceDate" value={formValues.serviceDate} onChange={handleChange} />
                {errors.serviceDate && <small className={styles.errorText}>{errors.serviceDate}</small>}
              </label>

              <label className={styles.field}>
                <span>Mechanic Name</span>
                <input name="mechanicName" value={formValues.mechanicName} onChange={handleChange} placeholder="Enter mechanic name" />
                {errors.mechanicName && <small className={styles.errorText}>{errors.mechanicName}</small>}
              </label>

              <label className={styles.field}>
                <span>Service Type</span>
                <input name="serviceType" value={formValues.serviceType} onChange={handleChange} placeholder="e.g. Brake Service" />
                {errors.serviceType && <small className={styles.errorText}>{errors.serviceType}</small>}
              </label>
            </div>

            <label className={styles.field}>
              <span>Parts Replaced</span>
              <input name="partsReplaced" value={formValues.partsReplaced} onChange={handleChange} placeholder="List replaced parts" />
              {errors.partsReplaced && <small className={styles.errorText}>{errors.partsReplaced}</small>}
            </label>

            <label className={styles.field}>
              <span>Description</span>
              <textarea name="description" value={formValues.description} onChange={handleChange} rows="4" placeholder="Describe the service work performed" />
              {errors.description && <small className={styles.errorText}>{errors.description}</small>}
            </label>

            <label className={styles.field}>
              <span>Notes</span>
              <textarea name="notes" value={formValues.notes} onChange={handleChange} rows="3" placeholder="Add any follow-up notes" />
              {errors.notes && <small className={styles.errorText}>{errors.notes}</small>}
            </label>

            <div className={styles.formActions}>
              <button type="submit" className={styles.primaryButton}>Save</button>
              <button type="button" className={styles.secondaryButton} onClick={handleCancel}>Cancel</button>
            </div>
          </form>
        </section>

        <aside className={styles.formCard}>
          <h2 className={styles.sectionTitle}>Recent submissions</h2>
          <p className={styles.sectionSubtitle}>Submitted logs are stored in local component state.</p>

          {submittedLogs.length === 0 ? (
            <div className={styles.emptyState}>No service logs saved yet.</div>
          ) : (
            <div className={styles.submissionList}>
              {submittedLogs.map((item) => (
                <article key={item.id} className={styles.submissionItem}>
                  <strong>{item.vehicle}</strong>
                  <span>{item.serviceType}</span>
                  <small>{item.mechanicName} • {item.serviceDate}</small>
                </article>
              ))}
            </div>
          )}
        </aside>
      </div>
    </>
  );
}
