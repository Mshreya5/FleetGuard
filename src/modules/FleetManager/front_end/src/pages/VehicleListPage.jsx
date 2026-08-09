import React, { useState, useEffect } from 'react';
import VehicleTable from '../components/VehicleTable';
import Loader from '../components/Loader';
import ConfirmationDialog from '../components/ConfirmationDialog';
import Modal from '../components/Modal';
import { getVehicles, deleteVehicle, updateVehicle } from '../services/api';
import { COLORS, COMMON_STYLES } from '../utils/styles';

const FUEL_TYPES = ["Diesel", "Petrol", "Electric", "Hybrid", "CNG"];
const VEHICLE_TYPES = ["Truck", "Van", "Sedan", "SUV", "Bus", "Trailer"];
const BRANCHES = ["North Hub", "South Terminal", "East Depot", "West Station", "Central HQ"];

const VehicleListPage = ({
    onNavigate,
    onSelectVehicle,
    onUploadClick,
    showToast,
    globalSearchQuery
}) => {
    const [vehicles, setVehicles] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [search, setSearch] = useState(globalSearchQuery || "");
    const [statusFilter, setStatusFilter] = useState("All");
    const [loading, setLoading] = useState(true);

    // Delete Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [vehicleToDelete, setVehicleToDelete] = useState(null);

    // Edit Modal State (FG-FM-05)
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editForm, setEditForm] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (globalSearchQuery !== undefined) {
            setSearch(globalSearchQuery);
        }
    }, [globalSearchQuery]);

    const fetchVehiclesList = async () => {
        setLoading(true);
        try {
            const data = await getVehicles({
                search,
                status: statusFilter,
                page,
                limit: 10
            });
            setVehicles(data.vehicles || []);
            setTotal(data.total || 0);
            setPages(data.pages || 1);
        } catch (err) {
            showToast(err.message || 'Failed to fetch vehicles', 'danger');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVehiclesList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, search, statusFilter]);

    // Handle Delete (FG-FM-06)
    const handleDeleteConfirm = async () => {
        if (!vehicleToDelete) return;
        try {
            await deleteVehicle(vehicleToDelete._id);
            showToast(`Vehicle ${vehicleToDelete.registrationNumber} deleted successfully`, 'success');
            setDeleteModalOpen(false);
            setVehicleToDelete(null);
            fetchVehiclesList();
        } catch (err) {
            showToast(err.message || 'Delete failed', 'danger');
        }
    };

    // Handle Edit Open (FG-FM-05)
    const handleOpenEdit = (v) => {
        setEditForm({
            _id: v._id,
            registrationNumber: v.registrationNumber,
            model: v.model,
            brand: v.brand,
            branch: v.branch,
            mileage: v.mileage,
            status: v.status,
            fuelType: v.fuelType,
            vehicleType: v.vehicleType,
            assignedDriver: v.assignedDriver || "Unassigned"
        });
        setEditModalOpen(true);
    };

    const handleSaveEdit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await updateVehicle(editForm._id, {
                model: editForm.model,
                brand: editForm.brand,
                mileage: Number(editForm.mileage),
                branch: editForm.branch,
                status: editForm.status,
                fuelType: editForm.fuelType,
                vehicleType: editForm.vehicleType,
                assignedDriver: editForm.assignedDriver
            });
            showToast(`Vehicle ${editForm.registrationNumber} updated successfully`, 'success');
            setEditModalOpen(false);
            fetchVehiclesList();
        } catch (err) {
            showToast(err.message || 'Failed to update vehicle', 'danger');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div>
            <div style={{ marginBottom: '16px' }}>
                <h2 style={COMMON_STYLES.heading}>FG-FM-03: Vehicle List & Operations</h2>
                <p style={COMMON_STYLES.subheading}>Search, filter, view, edit, upload compliance, or delete fleet vehicles</p>
            </div>

            {loading ? (
                <Loader message="Loading vehicle fleet data..." />
            ) : (
                <VehicleTable
                    vehicles={vehicles}
                    total={total}
                    page={page}
                    pages={pages}
                    search={search}
                    statusFilter={statusFilter}
                    onSearchChange={(val) => {
                        setSearch(val);
                        setPage(1);
                    }}
                    onStatusFilterChange={(val) => {
                        setStatusFilter(val);
                        setPage(1);
                    }}
                    onPageChange={setPage}
                    onViewDetails={(id) => {
                        onSelectVehicle(id);
                        onNavigate('details');
                    }}
                    onEditVehicle={handleOpenEdit}
                    onDeleteClick={(v) => {
                        setVehicleToDelete(v);
                        setDeleteModalOpen(true);
                    }}
                    onUploadClick={(v) => {
                        onSelectVehicle(v._id);
                        onUploadClick(v);
                    }}
                />
            )}

            {/* FG-FM-06 Delete Confirmation Dialog */}
            <ConfirmationDialog
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                title="Delete Vehicle Confirmation"
                message={`Are you sure you want to delete vehicle "${vehicleToDelete?.registrationNumber}"? This will permanently remove its records and compliance documents from MongoDB.`}
            />

            {/* FG-FM-05 Edit Vehicle Modal */}
            <Modal
                isOpen={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                title={`FG-FM-05: Edit Vehicle (${editForm?.registrationNumber})`}
            >
                {editForm && (
                    <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                            <div>
                                <label style={COMMON_STYLES.label}>Vehicle Model</label>
                                <input
                                    type="text"
                                    value={editForm.model}
                                    onChange={(e) => setEditForm({ ...editForm, model: e.target.value })}
                                    style={COMMON_STYLES.input}
                                />
                            </div>
                            <div>
                                <label style={COMMON_STYLES.label}>Mileage (km)</label>
                                <input
                                    type="number"
                                    value={editForm.mileage}
                                    onChange={(e) => setEditForm({ ...editForm, mileage: e.target.value })}
                                    style={COMMON_STYLES.input}
                                />
                            </div>
                            <div>
                                <label style={COMMON_STYLES.label}>Branch Location</label>
                                <select
                                    value={editForm.branch}
                                    onChange={(e) => setEditForm({ ...editForm, branch: e.target.value })}
                                    style={COMMON_STYLES.select}
                                >
                                    {BRANCHES.map(b => (
                                        <option key={b} value={b}>{b}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={COMMON_STYLES.label}>Operational Status</label>
                                <select
                                    value={editForm.status}
                                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                                    style={COMMON_STYLES.select}
                                >
                                    <option value="Available">Available</option>
                                    <option value="Assigned">Assigned</option>
                                    <option value="Maintenance">Maintenance</option>
                                </select>
                            </div>
                            <div>
                                <label style={COMMON_STYLES.label}>Fuel Type</label>
                                <select
                                    value={editForm.fuelType}
                                    onChange={(e) => setEditForm({ ...editForm, fuelType: e.target.value })}
                                    style={COMMON_STYLES.select}
                                >
                                    {FUEL_TYPES.map(f => (
                                        <option key={f} value={f}>{f}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={COMMON_STYLES.label}>Vehicle Type</label>
                                <select
                                    value={editForm.vehicleType}
                                    onChange={(e) => setEditForm({ ...editForm, vehicleType: e.target.value })}
                                    style={COMMON_STYLES.select}
                                >
                                    {VEHICLE_TYPES.map(vt => (
                                        <option key={vt} value={vt}>{vt}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={COMMON_STYLES.label}>Assigned Driver</label>
                                <input
                                    type="text"
                                    value={editForm.assignedDriver}
                                    onChange={(e) => setEditForm({ ...editForm, assignedDriver: e.target.value })}
                                    style={COMMON_STYLES.input}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '14px', borderTop: `1px solid ${COLORS.border}` }}>
                            <button type="button" onClick={() => setEditModalOpen(false)} style={COMMON_STYLES.buttonSecondary}>
                                Cancel
                            </button>
                            <button type="submit" disabled={isSaving} style={COMMON_STYLES.buttonPrimary}>
                                {isSaving ? 'Saving...' : 'Save to MongoDB'}
                            </button>
                        </div>
                    </form>
                )}
            </Modal>
        </div>
    );
};

export default VehicleListPage;
