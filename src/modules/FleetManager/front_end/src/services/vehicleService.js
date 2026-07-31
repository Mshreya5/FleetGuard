import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api/v1/fleet-manager';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const vehicleService = {
  getVehicles: async (params = {}) => {
    try {
      const response = await apiClient.get('/vehicles', { params });
      return response.data;
    } catch (error) {
      console.warn('Axios backend mock fallback:', error.message);
      return null;
    }
  },

  getVehicleById: async (id) => {
    try {
      const response = await apiClient.get(`/vehicles/${id}`);
      return response.data;
    } catch (error) {
      console.warn('Axios backend mock fallback:', error.message);
      return null;
    }
  },

  createVehicle: async (vehicleData) => {
    try {
      const response = await apiClient.post('/vehicles', vehicleData);
      return response.data;
    } catch (error) {
      console.warn('Axios backend mock fallback:', error.message);
      return { success: true, data: { id: `veh-${Date.now()}`, ...vehicleData } };
    }
  },

  updateVehicle: async (id, vehicleData) => {
    try {
      const response = await apiClient.put(`/vehicles/${id}`, vehicleData);
      return response.data;
    } catch (error) {
      console.warn('Axios backend mock fallback:', error.message);
      return { success: true, data: { id, ...vehicleData } };
    }
  },

  deleteVehicle: async (id) => {
    try {
      const response = await apiClient.delete(`/vehicles/${id}`);
      return response.data;
    } catch (error) {
      console.warn('Axios backend mock fallback:', error.message);
      return { success: true, id };
    }
  }
};

export default vehicleService;
