import React from 'react';
import './fleetManager.css';

const VehicleRegistrationForm = ({ formData, errors, onChange, onSubmit, onReset }) => {
  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="registrationNo">Vehicle Registration Number</label>
          <input
            id="registrationNo"
            name="registrationNo"
            value={formData.registrationNo}
            onChange={onChange}
            placeholder="e.g. KA01AB1234"
          />
          <div className="error-text">{errors.registrationNo || ''}</div>
        </div>

        <div className="field">
          <label htmlFor="model">Vehicle Model</label>
          <input
            id="model"
            name="model"
            value={formData.model}
            onChange={onChange}
            placeholder="e.g. Tata Ace"
          />
          <div className="error-text">{errors.model || ''}</div>
        </div>

        <div className="field">
          <label htmlFor="brand">Vehicle Brand</label>
          <input
            id="brand"
            name="brand"
            value={formData.brand}
            onChange={onChange}
            placeholder="e.g. Tata Motors"
          />
          <div className="error-text">{errors.brand || ''}</div>
        </div>

        <div className="field">
          <label htmlFor="branch">Branch</label>
          <input
            id="branch"
            name="branch"
            value={formData.branch}
            onChange={onChange}
            placeholder="e.g. Bangalore"
          />
          <div className="error-text">{errors.branch || ''}</div>
        </div>

        <div className="field">
          <label htmlFor="year">Manufacturing Year</label>
          <input
            id="year"
            name="year"
            type="number"
            value={formData.year}
            onChange={onChange}
            placeholder="e.g. 2023"
          />
          <div className="error-text">{errors.year || ''}</div>
        </div>

        <div className="field">
          <label htmlFor="mileage">Current Mileage (km)</label>
          <input
            id="mileage"
            name="mileage"
            type="number"
            value={formData.mileage}
            onChange={onChange}
            placeholder="e.g. 42000"
          />
          <div className="error-text">{errors.mileage || ''}</div>
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          Save Vehicle
        </button>
        <button type="button" className="btn btn-secondary" onClick={onReset}>
          Reset
        </button>
      </div>
    </form>
  );
};

export default VehicleRegistrationForm;
