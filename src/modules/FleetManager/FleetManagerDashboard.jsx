import React, { useMemo, useState } from 'react';
import './fleetManager.css';
import DashboardCards from './DashboardCards';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import VehicleRegistrationForm from './VehicleRegistrationForm';
import VehicleTable from './VehicleTable';

const initialVehicles = [
  {
    id: 1,
    registrationNo: 'KA01AB1234',
    model: 'Tata Ace',
    brand: 'Tata Motors',
    branch: 'Bangalore',
    year: 2023,
    mileage: 42000,
    status: 'Valid',
    assigned: true,
  },
  {
    id: 2,
    registrationNo: 'MH12CD5678',
    model: 'Mahindra Bolero',
    brand: 'Mahindra',
    branch: 'Mumbai',
    year: 2021,
    mileage: 118000,
    status: 'Expiring Soon',
    assigned: true,
  },
  {
    id: 3,
    registrationNo: 'DL04EF9012',
    model: 'Ashok Leyland Dost',
    brand: 'Ashok Leyland',
    branch: 'Delhi',
    year: 2020,
    mileage: 145000,
    status: 'Expired',
    assigned: false,
  },
  {
    id: 4,
    registrationNo: 'TN07GH3456',
    model: 'Force Traveller',
    brand: 'Force Motors',
    branch: 'Chennai',
    year: 2022,
    mileage: 76000,
    status: 'Valid',
    assigned: true,
  },
  {
    id: 5,
    registrationNo: 'KA05IJ7890',
    model: 'Eicher Pro 2049',
    brand: 'Eicher',
    branch: 'Bangalore',
    year: 2024,
    mileage: 24000,
    status: 'Valid',
    assigned: false,
  },
  {
    id: 6,
    registrationNo: 'HR26KL1122',
    model: 'Maruti Suzuki Super Carry',
    brand: 'Maruti Suzuki',
    branch: 'Gurugram',
    year: 2021,
    mileage: 98000,
    status: 'Expiring Soon',
    assigned: true,
  },
  {
    id: 7,
    registrationNo: 'PB03MN4455',
    model: 'Tata 407',
    brand: 'Tata Motors',
    branch: 'Chandigarh',
    year: 2019,
    mileage: 156000,
    status: 'Expired',
    assigned: false,
  },
  {
    id: 8,
    registrationNo: 'AP09OP6789',
    model: 'Mahindra Loadking',
    brand: 'Mahindra',
    branch: 'Hyderabad',
    year: 2023,
    mileage: 61000,
    status: 'Valid',
    assigned: true,
  },
];

const initialFormState = {
  registrationNo: '',
  model: '',
  brand: '',
  branch: '',
  year: '',
  mileage: '',
};

const getStatus = (year, mileage) => {
  if (year <= 2020 || mileage >= 140000) {
    return 'Expired';
  }

  if (year <= 2022 || mileage >= 100000) {
    return 'Expiring Soon';
  }

  return 'Valid';
};

const FleetManagerDashboard = () => {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [activeView, setActiveView] = useState('dashboard');
  const [successMessage, setSuccessMessage] = useState('');

  const summary = useMemo(
    () => ({
      total: vehicles.length,
      assigned: vehicles.filter((vehicle) => vehicle.assigned).length,
      available: vehicles.filter((vehicle) => !vehicle.assigned).length,
    }),
    [vehicles]
  );

  const complianceSummary = useMemo(
    () => ({
      valid: vehicles.filter((vehicle) => vehicle.status === 'Valid').length,
      expiringSoon: vehicles.filter((vehicle) => vehicle.status === 'Expiring Soon').length,
      expired: vehicles.filter((vehicle) => vehicle.status === 'Expired').length,
    }),
    [vehicles]
  );

  const filteredVehicles = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) {
      return vehicles;
    }

    return vehicles.filter((vehicle) => {
      return [vehicle.registrationNo, vehicle.model, vehicle.branch].some((value) =>
        value.toLowerCase().includes(term)
      );
    });
  }, [vehicles, searchTerm]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));

    if (errors[name]) {
      setErrors((previous) => ({ ...previous, [name]: '' }));
    }
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    if (activeView !== 'vehicle-list') {
      setActiveView('vehicle-list');
    }
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.registrationNo.trim()) {
      nextErrors.registrationNo = 'Registration number is required.';
    }

    if (!formData.model.trim()) {
      nextErrors.model = 'Vehicle model is required.';
    }

    if (!formData.brand.trim()) {
      nextErrors.brand = 'Vehicle brand is required.';
    }

    if (!formData.branch.trim()) {
      nextErrors.branch = 'Branch is required.';
    }

    if (!formData.year.trim()) {
      nextErrors.year = 'Manufacturing year is required.';
    } else if (Number.isNaN(Number(formData.year)) || Number(formData.year) < 1900) {
      nextErrors.year = 'Enter a valid manufacturing year.';
    }

    if (!formData.mileage.trim()) {
      nextErrors.mileage = 'Current mileage is required.';
    } else if (Number.isNaN(Number(formData.mileage)) || Number(formData.mileage) < 0) {
      nextErrors.mileage = 'Enter a valid mileage in km.';
    }

    return nextErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validateForm();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const newVehicle = {
      id: Date.now(),
      registrationNo: formData.registrationNo.trim().toUpperCase(),
      model: formData.model.trim(),
      brand: formData.brand.trim(),
      branch: formData.branch.trim(),
      year: Number(formData.year),
      mileage: Number(formData.mileage),
      status: getStatus(Number(formData.year), Number(formData.mileage)),
      assigned: false,
    };

    setVehicles((previous) => [newVehicle, ...previous]);
    setFormData(initialFormState);
    setErrors({});
    setSuccessMessage(`Vehicle ${newVehicle.registrationNo} registered successfully.`);
    setActiveView('vehicle-list');
  };

  const handleReset = () => {
    setFormData(initialFormState);
    setErrors({});
    setSuccessMessage('');
  };

  const renderContent = () => {
    if (activeView === 'vehicle-registration') {
      return (
        <section className="section-card" id="vehicle-registration">
          <h2 className="section-title">Vehicle Registration</h2>
          <VehicleRegistrationForm
            formData={formData}
            errors={errors}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onReset={handleReset}
          />
          {successMessage && <p className="success-text">{successMessage}</p>}
        </section>
      );
    }

    if (activeView === 'vehicle-list') {
      return (
        <section className="section-card" id="vehicle-list">
          <h2 className="section-title">Registered Vehicles</h2>
          <VehicleTable vehicles={filteredVehicles} searchTerm={searchTerm} />
        </section>
      );
    }

    return (
      <>
        <DashboardCards summary={summary} complianceSummary={complianceSummary} />
        <section className="section-card">
          <h2 className="section-title">Fleet operations overview</h2>
          <p className="card-detail">
            Use the sidebar to register vehicles or review the active fleet table. The search box filters vehicles by registration number, model, or branch.
          </p>
        </section>
      </>
    );
  };

  return (
    <div className="dashboard-shell">
      <Sidebar activeView={activeView} onNavigate={setActiveView} />

      <div className="main-panel">
        <TopNavbar searchTerm={searchTerm} onSearchChange={handleSearchChange} />

        <main className="content">
          <header className="page-header">
            <div>
              <h1>Fleet Manager Dashboard</h1>
              <p>Operational visibility across fleet registration, status, and compliance.</p>
            </div>
          </header>

          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default FleetManagerDashboard;
