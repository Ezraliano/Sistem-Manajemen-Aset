import api from '../config/api';

export const locationsAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/locations', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/locations/${id}`);
    return response.data;
  },

  create: async (locationData) => {
    const response = await api.post('/locations', locationData);
    return response.data;
  },

  update: async (id, locationData) => {
    const response = await api.put(`/locations/${id}`, locationData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/locations/${id}`);
    return response.data;
  },
};