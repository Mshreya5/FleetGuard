const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const handleResponse = async (response) => {
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(data.message || `HTTP Error ${response.status}`);
    }
    return data;
};

// Dashboard Summary API
export const getDashboardSummary = async () => {
    const res = await fetch(`${API_BASE_URL}/dashboard/summary`);
    return handleResponse(res);
};

// Vehicles APIs
export const getVehicles = async ({ search = "", status = "All", page = 1, limit = 10 } = {}) => {
    const params = new URLSearchParams({ search, status, page, limit });
    const res = await fetch(`${API_BASE_URL}/vehicles?${params.toString()}`);
    return handleResponse(res);
};

export const getVehicleById = async (id) => {
    const res = await fetch(`${API_BASE_URL}/vehicles/${id}`);
    return handleResponse(res);
};

export const createVehicle = async (vehicleData) => {
    const res = await fetch(`${API_BASE_URL}/vehicles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vehicleData)
    });
    return handleResponse(res);
};

export const updateVehicle = async (id, vehicleData) => {
    const res = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vehicleData)
    });
    return handleResponse(res);
};

export const deleteVehicle = async (id) => {
    const res = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
        method: "DELETE"
    });
    return handleResponse(res);
};

// Compliance APIs
export const uploadComplianceDocument = async (formData) => {
    const res = await fetch(`${API_BASE_URL}/compliance/upload`, {
        method: "POST",
        body: formData
    });
    return handleResponse(res);
};

export const getComplianceStatus = async () => {
    const res = await fetch(`${API_BASE_URL}/compliance/status`);
    return handleResponse(res);
};

export const getUpcomingExpiries = async (days = 30) => {
    const res = await fetch(`${API_BASE_URL}/compliance/upcoming-expiry?days=${days}`);
    return handleResponse(res);
};

// Assignments APIs
export const assignVehicle = async (assignmentData) => {
    const res = await fetch(`${API_BASE_URL}/assignments/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(assignmentData)
    });
    return handleResponse(res);
};

export const unassignVehicle = async (vehicleId) => {
    const res = await fetch(`${API_BASE_URL}/assignments/unassign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vehicleId })
    });
    return handleResponse(res);
};

export const getAssignments = async () => {
    const res = await fetch(`${API_BASE_URL}/assignments`);
    return handleResponse(res);
};
