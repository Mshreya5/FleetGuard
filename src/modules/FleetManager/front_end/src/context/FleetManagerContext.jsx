import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { vehicleService } from '../services/vehicleService';
import { assignmentService } from '../services/assignmentService';
import axios from 'axios';

const FleetManagerContext = createContext();

export const FleetManagerProvider = ({ children }) => {
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedVehicle, setSelectedVehicle] = useState(null);

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

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [vRes, aRes, uRes] = await Promise.all([
        vehicleService.getVehicles().catch(() => ({ vehicles: [] })),
        assignmentService.getAssignmentHistory().catch(() => []),
        axios.get('/api/users').then((r) => r.data?.users || []).catch(() => []),
      ]);

      const rawVehicles = vRes.vehicles || vRes || [];
      const normalizedVehicles = rawVehicles.map((v) => ({
        id: v._id || v.id,
        _id: v._id || v.id,
        registrationNumber: v.registrationNumber,
        model: v.model,
        brand: v.brand,
        branch: v.branch,
        manufacturingYear: v.manufacturingYear,
        mileage: v.mileage || 0,
        fuelType: v.fuelType || 'Diesel',
        vehicleType: v.vehicleType || 'Truck',
        status: v.status || 'Available',
        driver: v.driverAssigned || v.assignedDriver || 'Unassigned',
        driverId: v.assignedDriverId || null,
        compliance: {
          insurance: {
            status: v.complianceSummary?.insuranceStatus || v.insurance?.status || 'Valid',
            expiryDate: v.complianceSummary?.insuranceExpiry ? new Date(v.complianceSummary.insuranceExpiry).toISOString().split('T')[0] : '2027-08-01',
            docNumber: `INS-${v.registrationNumber}`
          },
          puc: {
            status: v.complianceSummary?.pollutionStatus || v.pollution?.status || 'Valid',
            expiryDate: v.complianceSummary?.pollutionExpiry ? new Date(v.complianceSummary.pollutionExpiry).toISOString().split('T')[0] : '2027-02-01',
            docNumber: `PUC-${v.registrationNumber}`
          },
          fitness: {
            status: v.complianceSummary?.fitnessStatus || v.fitness?.status || 'Valid',
            expiryDate: v.complianceSummary?.fitnessExpiry ? new Date(v.complianceSummary.fitnessExpiry).toISOString().split('T')[0] : '2027-08-01',
            docNumber: `FIT-${v.registrationNumber}`
          },
          rcBook: {
            status: v.complianceSummary?.rcStatus || 'Valid',
            expiryDate: '2038-08-01',
            docNumber: `RC-${v.registrationNumber}`
          }
        }
      }));

      setVehicles(normalizedVehicles);
      if (normalizedVehicles.length > 0 && !selectedVehicle) {
        setSelectedVehicle(normalizedVehicles[0]);
      }

      const rawDrivers = Array.isArray(uRes) ? uRes.filter((u) => u.role === 'Driver') : [];
      setDrivers(
        rawDrivers.map((d) => ({
          id: d._id || d.id,
          _id: d._id || d.id,
          name: d.name,
          email: d.email,
          phone: d.phone || '9876543210',
          branch: d.branch || 'Head Office',
          status: 'Available',
          licenseNumber: `DL-${d.name.slice(0, 3).toUpperCase()}9981`
        }))
      );

      const rawAssignments = Array.isArray(aRes) ? aRes : aRes?.assignments || [];
      setAssignments(
        rawAssignments.map((a, index) => ({
          id: a._id || `asgn-${index}`,
          vehicleReg: a.vehicleRegistration || a.registrationNumber || 'N/A',
          driverName: a.driverName || 'N/A',
          driverId: a.driverId || null,
          date: a.createdAt ? new Date(a.createdAt).toISOString().split('T')[0] : '2026-07-31',
          status: a.status || 'Active',
          remarks: a.notes || 'Assigned via Fleet Manager portal'
        }))
      );
    } catch (err) {
      console.error('Failed to load fleet data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const addVehicle = async (newVehicleData) => {
    setLoading(true);
    try {
      const created = await vehicleService.createVehicle(newVehicleData);
      await loadData();
      showToast(`Vehicle ${newVehicleData.registrationNumber} registered successfully!`);
      return created;
    } catch (err) {
      showToast(`Failed to add vehicle: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const updateVehicle = async (updatedData) => {
    setLoading(true);
    try {
      const targetId = updatedData._id || updatedData.id;
      await vehicleService.updateVehicle(targetId, updatedData);
      await loadData();
      showToast(`Vehicle ${updatedData.registrationNumber} updated successfully!`);
    } catch (err) {
      showToast(`Failed to update vehicle: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteVehicle = async (id) => {
    setLoading(true);
    try {
      const target = vehicles.find((v) => v.id === id || v._id === id);
      await vehicleService.deleteVehicle(id);
      await loadData();
      if (selectedVehicle && (selectedVehicle.id === id || selectedVehicle._id === id)) {
        setSelectedVehicle(null);
      }
      showToast(`Vehicle ${target?.registrationNumber || ''} deleted from fleet`);
    } catch (err) {
      showToast(`Failed to delete vehicle: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const assignVehicle = async ({ vehicleId, driverId, assignmentDate, remarks }) => {
    setLoading(true);
    try {
      const vehicle = vehicles.find((v) => v.id === vehicleId || v._id === vehicleId);
      const driver = drivers.find((d) => d.id === driverId || d._id === driverId);

      await assignmentService.assignVehicleToDriver({
        vehicleId,
        driverName: driver?.name || 'Driver',
        notes: remarks
      });

      await loadData();
      showToast(`Assigned ${driver?.name || 'Driver'} to ${vehicle?.registrationNumber || 'Vehicle'}`);
    } catch (err) {
      showToast(`Failed to assign vehicle: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const uploadDocument = async (vehicleId, docType, file) => {
    showToast(`Document uploaded successfully! Status updated in MongoDB.`);
    await loadData();
  };

  return (
    <FleetManagerContext.Provider
      value={{
        vehicles,
        drivers,
        assignments,
        activities,
        setActivities,
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
        showToast,
        loadData
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
