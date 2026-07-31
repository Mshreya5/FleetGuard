import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './ServiceCenterDashboard.module.css';

const initialForm = {
  vehicle: '',
  labourCost: '',
  sparePartsCost: '',
  otherCharges: '',
  description: '',
};

export default function RecordServiceCost() {
  const [formValues, setFormValues] = useState(initialForm);
  const [records, setRecords] = useState([]);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const totalCost = Number(formValues.labourCost || 0) + Number(formValues.sparePartsCost || 0) + Number(formValues.otherCharges || 0);

  const validate = () => {
    const nextErrors = {};
    if (!formValues.vehicle.trim()) nextErrors.vehicle = 'Vehicle is required';
    if (!formValues.labourCost) nextErrors.labourCost = 'Labour cost is required';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const fetchRecords = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/service-center/extensions/costs');
      setRecords(response.data);
    } catch (error) {
      console.error('Unable to fetch service costs', error);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    try {
      await axios.post('http://localhost:5000/api/service-center/extensions/costs', {
        ...formValues,
        labourCost: Number(formValues.labourCost),
        sparePartsCost: Number(formValues.sparePartsCost || 0),
        otherCharges: Number(formValues.otherCharges || 0),
      });
      setStatus('Service cost saved successfully.');
      setFormValues(initialForm);
      fetchRecords();
    } catch (error) {
      setStatus(error.response?.data?.message || 'Unable to save service cost.');
    }
  };

  return (
    <>
      <header className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Service Center</p>
          <h1 className={styles.pageTitle}>Record Service Cost</h1>
          <p className={styles.pageSubtitle}>Capture labour, parts, and other service charges for each vehicle visit.</p>
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
                <span>Labour Cost</span>
                <input type="number" name="labourCost" value={formValues.labourCost} onChange={handleChange} />
                {errors.labourCost && <small className={styles.errorText}>{errors.labourCost}</small>}
              </label>

              <label className={styles.field}>
                <span>Spare Parts Cost</span>
                <input type="number" name="sparePartsCost" value={formValues.sparePartsCost} onChange={handleChange} />
              </label>

              <label className={styles.field}>
                <span>Other Charges</span>
                <input type="number" name="otherCharges" value={formValues.otherCharges} onChange={handleChange} />
              </label>
            </div>

            <label className={styles.field}>
              <span>Description</span>
              <textarea name="description" rows="3" value={formValues.description} onChange={handleChange} placeholder="Describe the job" />
            </label>

            <div className={styles.formActions}>
              <button type="submit" className={styles.primaryButton}>Save Cost</button>
            </div>
            {status && <p className={styles.sectionSubtitle}>{status}</p>}
          </form>
        </section>


      </div>
    </>
  );
}
