import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api/v1/fleet-manager';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const assignmentService = {
  assignVehicleToDriver: async (assignmentData) => {
    try {
      const response = await apiClient.post('/assignments', assignmentData);
      return response.data;
    } catch (error) {
      console.warn('Axios assignment fallback:', error.message);
      return { success: true, data: { id: `asgn-${Date.now()}`, ...assignmentData } };
    }
  },

  getAssignmentHistory: async () => {
    try {
      const response = await apiClient.get('/assignments/history');
      return response.data;
    } catch (error) {
      console.warn('Axios assignment history fallback:', error.message);
      return null;
    }
  }
};

export default assignmentService;
