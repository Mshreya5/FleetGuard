import { initialVehicles, initialDrivers } from '../../data/dummyData';

export const vehiclesData = initialVehicles;
export const drivers = initialDrivers;
export const vehicles = initialVehicles;
export const dashboardData = {
  totalVehicles: initialVehicles.length,
  assignedVehicles: initialVehicles.filter(v => v.status === 'Assigned').length,
  availableVehicles: initialVehicles.filter(v => v.status === 'Available').length,
  underService: initialVehicles.filter(v => v.status === 'Under Service').length
};