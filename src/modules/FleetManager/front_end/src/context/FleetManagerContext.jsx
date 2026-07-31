import React, { createContext, useContext, useState } from 'react';
import {
  initialVehicles,
  initialDrivers,
  initialAssignmentHistory,
  recentActivities as initialActivities
} from '../data/dummyData';
import { vehicleService } from '../services/vehicleService';
import { assignmentService } from '../services/assignmentService';

const FleetManagerContext = createContext();

export const FleetManagerProvider = ({ children }) => {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [drivers, setDrivers] = useState(initialDrivers);
  const [assignments, setAssignments] = useState(initialAssignmentHistory);
  const [activities, setActivities] = useState(initialActivities);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedVehicle, setSelectedVehicle] = useState(initialVehicles[0]);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingVehicle, setDeletingVehicle] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const addVehicle = async (newVehicleData) => {
    setLoading(true);
    await vehicleService.createVehicle(newVehicleData);
    const newVehicle = {
      id: `veh-${Date.now()}`,
      ...newVehicleData,
      driver: 'Unassigned',
      driverId: null,
      status: 'Available',
      compliance: {
        insurance: { status: 'Valid', expiryDate: '2027-08-01', docNumber: newVehicleData.insuranceNumber || 'INS-GEN-9912' },
        puc: { status: 'Valid', expiryDate: '2027-02-01', docNumber: 'PUC-GEN-8812' },
        fitness: { status: 'Valid', expiryDate: '2027-08-01', docNumber: 'FIT-GEN-7712' },
        rcBook: { status: 'Valid', expiryDate: '2038-08-01', docNumber: `RC-${newVehicleData.registrationNumber}` }
      }
    };

    setVehicles((prev) => [newVehicle, ...prev]);
    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        type: 'registration',
        text: `New vehicle ${newVehicle.registrationNumber} (${newVehicle.model}) registered`,
        timestamp: 'Just now'
      },
      ...prev
    ]);
    setLoading(false);
    showToast(`Vehicle ${newVehicle.registrationNumber} registered successfully!`);
    return newVehicle;
  };

  const updateVehicle = async (updatedData) => {
    setLoading(true);
    await vehicleService.updateVehicle(updatedData.id, updatedData);
    setVehicles((prev) =>
      prev.map((v) => (v.id === updatedData.id ? { ...v, ...updatedData } : v))
    );
    if (selectedVehicle && selectedVehicle.id === updatedData.id) {
      setSelectedVehicle((prev) => ({ ...prev, ...updatedData }));
    }
    setLoading(false);
    showToast(`Vehicle ${updatedData.registrationNumber} updated successfully!`);
  };

  const deleteVehicle = async (id) => {
    setLoading(true);
    await vehicleService.deleteVehicle(id);
    const target = vehicles.find((v) => v.id === id);
    setVehicles((prev) => prev.filter((v) => v.id !== id));
    if (selectedVehicle && selectedVehicle.id === id) {
      setSelectedVehicle(null);
    }
    setLoading(false);
    showToast(`Vehicle ${target?.registrationNumber || ''} deleted from fleet`);
  };

  const assignVehicle = async ({ vehicleId, driverId, assignmentDate, remarks }) => {
    setLoading(true);
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    const driver = drivers.find((d) => d.id === driverId);

    if (!vehicle || !driver) return;

    await assignmentService.assignVehicleToDriver({ vehicleId, driverId, assignmentDate, remarks });

    setVehicles((prev) =>
      prev.map((v) =>
        v.id === vehicleId
          ? { ...v, status: 'Assigned', driver: driver.name, driverId: driver.id }
          : v
      )
    );

    setDrivers((prev) =>
      prev.map((d) =>
        d.id === driverId
          ? { ...d, status: 'Assigned', currentVehicle: vehicle.registrationNumber }
          : d
      )
    );

    const newAssignment = {
      id: `asgn-${Date.now()}`,
      vehicleReg: vehicle.registrationNumber,
      driverName: driver.name,
      driverId: driver.id,
      date: assignmentDate,
      status: 'Active',
      remarks: remarks || 'Assigned via Fleet Manager portal'
    };

    setAssignments((prev) => [newAssignment, ...prev]);
    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        type: 'assignment',
        text: `Driver ${driver.name} assigned to ${vehicle.registrationNumber}`,
        timestamp: 'Just now'
      },
      ...prev
    ]);
    setLoading(false);
    showToast(`Assigned ${driver.name} to ${vehicle.registrationNumber}`);
  };

  const uploadDocument = (vehicleId, docType, file) => {
    const docNameMap = {
      insurance: 'Insurance Document',
      puc: 'PUC Certificate',
      fitness: 'Fitness Certificate',
      rcBook: 'RC Book'
    };
    
    setVehicles((prev) =>
      prev.map((v) => {
        if (v.id === vehicleId) {
          const updatedCompliance = { ...v.compliance };
          if (updatedCompliance[docType]) {
            updatedCompliance[docType] = {
              ...updatedCompliance[docType],
              status: 'Valid',
              expiryDate: '2027-12-31'
            };
          }
          return { ...v, compliance: updatedCompliance };
        }
        return v;
      })
    );

    showToast(`${docNameMap[docType] || 'Document'} uploaded successfully! Status updated to Valid.`);
  };

  return (
    <FleetManagerContext.Provider
      value={{
        vehicles,
        drivers,
        assignments,
        activities,
        loading,
        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter,
        selectedVehicle,
        setSelectedVehicle,
        activeTab,
        setActiveTab,
        isEditModalOpen,
        setIsEditModalOpen,
        editingVehicle,
        setEditingVehicle,
        isDeleteModalOpen,
        setIsDeleteModalOpen,
        deletingVehicle,
        setDeletingVehicle,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        assignVehicle,
        uploadDocument,
        toastMessage,
        showToast
      }}
    >
      {children}
    </FleetManagerContext.Provider>
  );
};

export const useFleetManager = () => {
  const context = useContext(FleetManagerContext);
  if (!context) {
    throw new Error('useFleetManager must be used within a FleetManagerProvider');
  }
  return context;
};
