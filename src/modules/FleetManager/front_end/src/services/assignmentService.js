import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const assignmentService = {
  assignVehicleToDriver: async (assignmentData) => {
    const response = await apiClient.post('/assignments/assign', assignmentData);
    return response.data;
  },

  unassignVehicle: async (assignmentData) => {
    const response = await apiClient.post('/assignments/unassign', assignmentData);
    return response.data;
  },

  getAssignmentHistory: async () => {
    const response = await apiClient.get('/assignments');
    return response.data;
  }
};

export default assignmentService;
