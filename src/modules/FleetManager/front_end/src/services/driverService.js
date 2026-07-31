import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api/v1/fleet-manager';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const driverService = {
  getDrivers: async () => {
    try {
      const response = await apiClient.get('/drivers');
      return response.data;
    } catch (error) {
      console.warn('Axios drivers fallback:', error.message);
      return null;
    }
  },

  getDriverById: async (id) => {
    try {
      const response = await apiClient.get(`/drivers/${id}`);
      return response.data;
    } catch (error) {
      console.warn('Axios driver by id fallback:', error.message);
      return null;
    }
  }
};

export default driverService;
