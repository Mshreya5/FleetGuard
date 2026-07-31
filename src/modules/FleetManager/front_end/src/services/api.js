import {
    initialVehicles,
    initialAssignmentHistory
} from '../data/dummyData';

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const handleResponse = async (response) => {
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(data.message || `HTTP Error ${response.status}`);
    }
    return data;
};

// Helper for local compliance calculation from dummy data
const getLocalComplianceStats = () => {
    let valid = 0;
    let expiringSoon = 0;
    let expired = 0;
    let expiringDocsCount = 0;

    initialVehicles.forEach(v => {
        if (!v.compliance) return;
        Object.values(v.compliance).forEach(doc => {
            if (doc.status === 'Valid') valid++;
            else if (doc.status === 'Expiring Soon') {
                expiringSoon++;
                expiringDocsCount++;
            } else if (doc.status === 'Expired') {
                expired++;
                expiringDocsCount++;
            }
        });
    });

    return { valid, expiringSoon, expired, expiringDocsCount };
};

// Dashboard Summary API
export const getDashboardSummary = async () => {
    try {
        const res = await fetch(`${API_BASE_URL}/dashboard/summary`);
        return await handleResponse(res);
    } catch (err) {
        console.warn('Backend API offline, using local dataset fallback:', err.message);
        const stats = getLocalComplianceStats();
        return {
            cards: {
                totalVehicles: initialVehicles.length,
                assignedVehicles: initialVehicles.filter(v => v.status === 'Assigned').length,
                availableVehicles: initialVehicles.filter(v => v.status === 'Available').length,
                complianceSummary: {
                    valid: stats.valid,
                    expiringSoon: stats.expiringSoon,
                    expired: stats.expired
                },
                expiringDocuments: stats.expiringDocsCount
            },
            recentlyAddedVehicles: initialVehicles.slice(0, 5).map(v => ({
                _id: v.id,
                registrationNumber: v.registrationNumber,
                model: v.model,
                brand: v.brand,
                branch: v.branch,
                status: v.status
            }))
        };
    }
};

// Vehicles APIs
export const getVehicles = async ({ search = "", status = "All", page = 1, limit = 10 } = {}) => {
    try {
        const params = new URLSearchParams({ search, status, page, limit });
        const res = await fetch(`${API_BASE_URL}/vehicles?${params.toString()}`);
        return await handleResponse(res);
    } catch (err) {
        console.warn('Backend API offline, using local dataset fallback:', err.message);
        let filtered = [...initialVehicles];

        if (search) {
            const s = search.toLowerCase();
            filtered = filtered.filter(v =>
                v.registrationNumber.toLowerCase().includes(s) ||
                v.model.toLowerCase().includes(s) ||
                v.brand.toLowerCase().includes(s) ||
                v.branch.toLowerCase().includes(s)
            );
        }

        if (status && status !== "All") {
            if (["Available", "Assigned", "Under Service", "Maintenance"].includes(status)) {
                filtered = filtered.filter(v => v.status === status);
            }
        }

        const total = filtered.length;
        const p = parseInt(page);
        const l = parseInt(limit);
        const skip = (p - 1) * l;
        const paginated = filtered.slice(skip, skip + l).map(v => ({
            ...v,
            _id: v._id || v.id,
            assignedDriver: v.driver || v.assignedDriver || "Unassigned"
        }));

        return {
            vehicles: paginated,
            total,
            page: p,
            pages: Math.ceil(total / l) || 1
        };
    }
};

export const getVehicleById = async (id) => {
    try {
        const res = await fetch(`${API_BASE_URL}/vehicles/${id}`);
        return await handleResponse(res);
    } catch (err) {
        console.warn('Backend API offline, using local dataset fallback:', err.message);
        const v = initialVehicles.find(item => item.id === id || item._id === id) || initialVehicles[0];

        const complianceDocs = [];
        if (v && v.compliance) {
            Object.entries(v.compliance).forEach(([type, info]) => {
                complianceDocs.push({
                    _id: `doc-${type}-${v.id}`,
                    documentType: type.toUpperCase(),
                    originalName: `${type}_${v.registrationNumber}.pdf`,
                    issueDate: '2025-01-01',
                    expiryDate: info.expiryDate,
                    status: info.status,
                    filePath: '#'
                });
            });
        }

        return {
            vehicle: {
                ...v,
                _id: v._id || v.id,
                assignedDriver: v.driver || v.assignedDriver || "Unassigned"
            },
            complianceDocs,
            assignmentHistory: initialAssignmentHistory.filter(a => a.vehicleReg === v?.registrationNumber)
        };
    }
};

export const createVehicle = async (vehicleData) => {
    try {
        const res = await fetch(`${API_BASE_URL}/vehicles`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(vehicleData)
        });
        return await handleResponse(res);
    } catch (err) {
        console.warn('Backend API offline, using local create fallback:', err.message);
        const newVehicle = {
            _id: `veh-${Date.now()}`,
            id: `veh-${Date.now()}`,
            ...vehicleData,
            status: "Available",
            assignedDriver: "Unassigned"
        };
        initialVehicles.unshift(newVehicle);
        return newVehicle;
    }
};

export const updateVehicle = async (id, vehicleData) => {
    try {
        const res = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(vehicleData)
        });
        return await handleResponse(res);
    } catch (err) {
        console.warn('Backend API offline, using local update fallback:', err.message);
        const index = initialVehicles.findIndex(v => v.id === id || v._id === id);
        if (index !== -1) {
            initialVehicles[index] = { ...initialVehicles[index], ...vehicleData };
        }
        return { _id: id, ...vehicleData };
    }
};

export const deleteVehicle = async (id) => {
    try {
        const res = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
            method: "DELETE"
        });
        return await handleResponse(res);
    } catch (err) {
        console.warn('Backend API offline, using local delete fallback:', err.message);
        const index = initialVehicles.findIndex(v => v.id === id || v._id === id);
        if (index !== -1) {
            initialVehicles.splice(index, 1);
        }
        return { message: "Vehicle deleted successfully", id };
    }
};

// Compliance APIs
export const uploadComplianceDocument = async (formData) => {
    try {
        const res = await fetch(`${API_BASE_URL}/compliance/upload`, {
            method: "POST",
            body: formData
        });
        return await handleResponse(res);
    } catch (err) {
        console.warn('Backend API offline, using local upload fallback:', err.message);
        return {
            message: "Document uploaded successfully (Local Fallback)",
            document: {
                _id: `doc-${Date.now()}`,
                documentType: formData.get ? formData.get('documentType') || 'Document' : 'Document',
                originalName: 'Uploaded_Document.pdf',
                status: 'Valid',
                expiryDate: '2027-12-31'
            }
        };
    }
};

export const getComplianceStatus = async () => {
    try {
        const res = await fetch(`${API_BASE_URL}/compliance/status`);
        return await handleResponse(res);
    } catch (err) {
        console.warn('Backend API offline, using local compliance fallback:', err.message);
        const docs = [];
        let valid = 0;
        let expiringSoon = 0;
        let expired = 0;

        initialVehicles.forEach(v => {
            if (!v.compliance) return;
            Object.entries(v.compliance).forEach(([type, info]) => {
                let status = info.status;
                if (status === 'Valid') valid++;
                else if (status === 'Expiring Soon') expiringSoon++;
                else if (status === 'Expired') expired++;

                docs.push({
                    _id: `doc-${type}-${v.id}`,
                    registrationNumber: v.registrationNumber,
                    documentType: type.toUpperCase(),
                    originalName: `${type}_${v.registrationNumber}.pdf`,
                    issueDate: '2025-01-01',
                    expiryDate: info.expiryDate,
                    status: status,
                    filePath: '#'
                });
            });
        });

        return {
            summary: {
                totalDocuments: docs.length,
                valid,
                expiringSoon,
                expired
            },
            documents: docs,
            vehiclesCount: initialVehicles.length
        };
    }
};

export const getUpcomingExpiries = async (days = 30) => {
    try {
        const res = await fetch(`${API_BASE_URL}/compliance/upcoming-expiry?days=${days}`);
        return await handleResponse(res);
    } catch (err) {
        console.warn('Backend API offline, using local expiry fallback:', err.message);
        const expirations = [];
        initialVehicles.forEach(v => {
            if (!v.compliance) return;
            Object.entries(v.compliance).forEach(([type, info]) => {
                if (info.status === 'Expiring Soon' || info.status === 'Expired') {
                    expirations.push({
                        _id: `exp-${type}-${v.id}`,
                        vehicleId: v.id,
                        registrationNumber: v.registrationNumber,
                        model: v.model,
                        brand: v.brand,
                        branch: v.branch,
                        documentType: type.toUpperCase(),
                        expiryDate: info.expiryDate,
                        daysRemaining: info.status === 'Expired' ? -5 : 12,
                        status: info.status
                    });
                }
            });
        });

        return {
            filterDays: days,
            totalCount: expirations.length,
            expirations
        };
    }
};

// Assignments APIs
export const assignVehicle = async (assignmentData) => {
    try {
        const res = await fetch(`${API_BASE_URL}/assignments/assign`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(assignmentData)
        });
        return await handleResponse(res);
    } catch (err) {
        console.warn('Backend API offline, using local assign fallback:', err.message);
        const newAsgn = {
            _id: `asgn-${Date.now()}`,
            vehicleId: assignmentData.vehicleId,
            registrationNumber: assignmentData.vehicleReg || 'KA-01-EQ-1001',
            driverName: assignmentData.driverName || 'Assigned Driver',
            assignedDate: assignmentData.assignedDate || new Date().toISOString(),
            status: 'Active',
            notes: assignmentData.notes || 'Assigned via portal'
        };
        initialAssignmentHistory.unshift(newAsgn);
        return { message: "Vehicle assigned successfully", assignment: newAsgn };
    }
};

export const unassignVehicle = async (vehicleId) => {
    try {
        const res = await fetch(`${API_BASE_URL}/assignments/unassign`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ vehicleId })
        });
        return await handleResponse(res);
    } catch (err) {
        console.warn('Backend API offline, using local unassign fallback:', err.message);
        return { message: "Vehicle unassigned successfully" };
    }
};

export const getAssignments = async () => {
    try {
        const res = await fetch(`${API_BASE_URL}/assignments`);
        return await handleResponse(res);
    } catch (err) {
        console.warn('Backend API offline, using local assignments fallback:', err.message);
        return initialAssignmentHistory.map(a => ({
            ...a,
            _id: a._id || a.id
        }));
    }
};

