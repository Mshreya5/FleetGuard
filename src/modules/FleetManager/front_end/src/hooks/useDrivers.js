import { useFleetManager } from '../context/FleetManagerContext';

export const useDrivers = () => {
  const { drivers, assignments, assignVehicle, vehicles } = useFleetManager();

  const availableDrivers = drivers.filter((d) => d.status === 'Unassigned' || !d.currentVehicle);

  return {
    drivers,
    availableDrivers,
    assignments,
    assignVehicle,
    vehicles
  };
};

export default useDrivers;
