import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './ServiceCenterDashboard.module.css';

export default function MaintenanceRiskLevel() {
  const [mileage, setMileage] = useState('');
  const [risk, setRisk] = useState(null);
  const [error, setError] = useState('');

  const fetchRisk = async () => {
    if (!mileage) {
      setRisk(null);
      return;
    }

    try {
      const response = await axios.get('/api/service-center/extensions/risk', {
        params: { mileage },
      });
      setRisk(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to calculate risk.');
    }
  };

  useEffect(() => {
    fetchRisk();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mileage]);

  return (
    <>
      <header className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Service Center</p>
          <h1 className={styles.pageTitle}>Maintenance Risk Level</h1>
          <p className={styles.pageSubtitle}>Assess maintenance urgency from current vehicle mileage.</p>
        </div>
      </header>

      <section className={styles.formCard}>
        <label className={styles.field}>
          <span>Current Mileage</span>
          <input type="number" value={mileage} onChange={(event) => setMileage(event.target.value)} placeholder="Enter mileage (e.g. 50000)" />
        </label>

        {error && <p className={styles.errorText}>{error}</p>}

        {risk && (
          <div className={styles.submissionList}>
            <article className={styles.submissionItem}>
              <strong>Risk Level</strong>
              <span className={`${styles.badge} ${styles[risk.color] || styles.priorityMedium}`}>{risk.level}</span>
            </article>
            <article className={styles.submissionItem}>
              <strong>Explanation</strong>
              <span>{risk.explanation}</span>
            </article>
            <article className={styles.submissionItem}>
              <strong>Recommendation</strong>
              <span>{risk.recommendation}</span>
            </article>
          </div>
        )}
      </section>
    </>
  );
}
