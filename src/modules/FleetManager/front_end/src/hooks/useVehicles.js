import { useFleetManager } from '../context/FleetManagerContext';

export const useVehicles = () => {
  const {
    vehicles,
    loading,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    selectedVehicle,
    setSelectedVehicle,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter
  } = useFleetManager();

  const filteredVehicles = vehicles.filter((v) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !query ||
      v.registrationNumber.toLowerCase().includes(query) ||
      v.model.toLowerCase().includes(query) ||
      v.brand.toLowerCase().includes(query) ||
      v.branch.toLowerCase().includes(query) ||
      (v.driver && v.driver.toLowerCase().includes(query));

    const matchesStatus =
      statusFilter === 'ALL' || v.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return {
    vehicles,
    filteredVehicles,
    loading,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    selectedVehicle,
    setSelectedVehicle,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter
  };
};

export default useVehicles;
