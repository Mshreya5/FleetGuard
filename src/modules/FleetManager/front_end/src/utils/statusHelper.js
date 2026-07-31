export const getVehicleStatusBadgeType = (status) => {
  switch (status) {
    case 'Available':
      return 'success';
    case 'Assigned':
      return 'amber';
    case 'Under Service':
      return 'danger';
    default:
      return 'secondary';
  }
};

export const getComplianceStatusBadgeType = (status) => {
  switch (status) {
    case 'Valid':
      return 'success';
    case 'Expiring Soon':
      return 'amber';
    case 'Expired':
      return 'danger';
    default:
      return 'secondary';
  }
};

export const getOverallVehicleCompliance = (vehicle) => {
  if (!vehicle || !vehicle.compliance) return 'Valid';
  const statuses = [
    vehicle.compliance.insurance?.status,
    vehicle.compliance.puc?.status,
    vehicle.compliance.fitness?.status,
    vehicle.compliance.rcBook?.status
  ];

  if (statuses.includes('Expired')) return 'Expired';
  if (statuses.includes('Expiring Soon')) return 'Expiring Soon';
  return 'Valid';
};
