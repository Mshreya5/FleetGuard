import axios from 'axios';

const API_BASE = '/api/driver';

export const fetchDriverDashboard = () => axios.get(`${API_BASE}/dashboard`);
export const fetchNotifications = () => axios.get(`${API_BASE}/notifications`);
export const fetchAssignments = () => axios.get(`${API_BASE}/assignments`);
export const fetchServiceHistory = () => axios.get(`${API_BASE}/service-history`);
export const submitChecklist = (payload) => axios.post(`${API_BASE}/checklist`, payload);
export const startTrip = () => axios.post(`${API_BASE}/trip/start`);
export const submitIssueReport = (payload) => axios.post(`${API_BASE}/issues`, payload);
