import React from 'react';
import './fleetManager.css';

const getStatusClass = (status) => {
  switch (status) {
    case 'Valid':
      return 'badge badge-valid';
    case 'Expiring Soon':
      return 'badge badge-warning';
    case 'Expired':
      return 'badge badge-danger';
    default:
      return 'badge';
  }
};

const VehicleTable = ({ vehicles, searchTerm }) => {
  if (!vehicles.length) {
    return <div className="empty-state">No vehicles matched “{searchTerm || 'your search'}”.</div>;
  }

  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>Registration No.</th>
            <th>Model</th>
            <th>Brand</th>
            <th>Branch</th>
            <th>Year</th>
            <th>Mileage</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((vehicle) => (
            <tr key={vehicle.id}>
              <td>{vehicle.registrationNo}</td>
              <td>{vehicle.model}</td>
              <td>{vehicle.brand}</td>
              <td>{vehicle.branch}</td>
              <td>{vehicle.year}</td>
              <td>{vehicle.mileage.toLocaleString()} km</td>
              <td>
                <span className={getStatusClass(vehicle.status)}>{vehicle.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VehicleTable;
