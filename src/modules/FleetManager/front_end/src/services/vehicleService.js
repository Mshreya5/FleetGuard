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

export const vehicleService = {
  getVehicles: async (params = {}) => {
    const response = await apiClient.get('/vehicles', { params });
    return response.data;
  },

  getVehicleById: async (id) => {
    const response = await apiClient.get(`/vehicles/${id}`);
    return response.data;
  },

  createVehicle: async (vehicleData) => {
    const response = await apiClient.post('/vehicles', vehicleData);
    return response.data;
  },

  updateVehicle: async (id, vehicleData) => {
    const response = await apiClient.put(`/vehicles/${id}`, vehicleData);
    return response.data;
  },

  deleteVehicle: async (id) => {
    const response = await apiClient.delete(`/vehicles/${id}`);
    return response.data;
  }
};

export default vehicleService;
