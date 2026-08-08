const API_BASE_URL = "/api";

const getAuthHeaders = (extraHeaders = {}) => {
    const token = localStorage.getItem("token");
    const headers = { ...extraHeaders };
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
};

const handleResponse = async (response) => {
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(data.message || `HTTP Error ${response.status}`);
    }
    return data;
};

// Dashboard Summary API
export const getDashboardSummary = async () => {
    try {
        const res = await fetch(`${API_BASE_URL}/dashboard/summary`, { headers: getAuthHeaders() });
        return await handleResponse(res);
    } catch (err) {
        return {
            cards: {
                totalVehicles: 0,
                assignedVehicles: 0,
                availableVehicles: 0,
                complianceSummary: {
                    valid: 0,
                    expiringSoon: 0,
                    expired: 0
                },
                expiringDocuments: 0
            },
            recentlyAddedVehicles: []
        };
    }
};

// Vehicles APIs
export const getVehicles = async ({ search = "", status = "All", page = 1, limit = 100 } = {}) => {
    try {
        const params = new URLSearchParams({ search, status, page, limit });
        const res = await fetch(`${API_BASE_URL}/vehicles?${params.toString()}`, { headers: getAuthHeaders() });
        return await handleResponse(res);
    } catch (err) {
        return {
            vehicles: [],
            total: 0,
            page: 1,
            totalPages: 1
        };
    }
};

export const getVehicleById = async (id) => {
    try {
        const res = await fetch(`${API_BASE_URL}/vehicles/${id}`, { headers: getAuthHeaders() });
        return await handleResponse(res);
    } catch (err) {
        return null;
    }
};

export const createVehicle = async (vehicleData) => {
    const res = await fetch(`${API_BASE_URL}/vehicles`, {
        method: "POST",
        headers: getAuthHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(vehicleData)
    });
    return await handleResponse(res);
};

export const updateVehicle = async (id, vehicleData) => {
    const res = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
        method: "PUT",
        headers: getAuthHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(vehicleData)
    });
    return await handleResponse(res);
};

export const deleteVehicle = async (id) => {
    const res = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
    });
    return await handleResponse(res);
};

// Assignment APIs
export const assignVehicleToDriver = async (data) => {
    const res = await fetch(`${API_BASE_URL}/assignments/assign`, {
        method: "POST",
        headers: getAuthHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(data)
    });
    return await handleResponse(res);
};

export const unassignVehicle = async (data) => {
    const res = await fetch(`${API_BASE_URL}/assignments/unassign`, {
        method: "POST",
        headers: getAuthHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(data)
    });
    return await handleResponse(res);
};

export const getAssignmentHistory = async () => {
    try {
        const res = await fetch(`${API_BASE_URL}/assignments`, { headers: getAuthHeaders() });
        const data = await handleResponse(res);
        if (Array.isArray(data)) return data;
        return data.assignments || data.history || [];
    } catch (err) {
        return [];
    }
};

export const assignVehicle = assignVehicleToDriver;
export const getAssignments = getAssignmentHistory;

// Compliance APIs
export const getComplianceStatus = async () => {
    try {
        const res = await fetch(`${API_BASE_URL}/compliance/status`, { headers: getAuthHeaders() });
        return await handleResponse(res);
    } catch (err) {
        return {
            summary: { totalDocuments: 0, valid: 0, expiringSoon: 0, expired: 0 },
            documents: [],
            vehiclesCount: 0
        };
    }
};

export const uploadComplianceDocument = async (formData) => {
    const res = await fetch(`${API_BASE_URL}/compliance/upload`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: formData
    });
    return await handleResponse(res);
};

export const getUpcomingExpiries = async (days = 30) => {
    try {
        const res = await fetch(`${API_BASE_URL}/compliance/upcoming-expiry?days=${days}`, { headers: getAuthHeaders() });
        return await handleResponse(res);
    } catch (err) {
        return { filterDays: days, totalCount: 0, expirations: [] };
    }
};
