import api from '../config/api';

export const itemsAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/items', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/items/${id}`);
    return response.data;
  },

  getByCode: async (code) => {
    const response = await api.get(`/items/code/${code}`);
    return response.data;
  },

  create: async (itemData) => {
    const response = await api.post('/items', itemData);
    return response.data;
  },

  update: async (id, itemData) => {
    const response = await api.put(`/items/${id}`, itemData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/items/${id}`);
    return response.data;
  },

  generateQR: async (id) => {
    const response = await api.get(`/items/${id}/qr-code`, {
      responseType: 'blob'
    });
    return response.data;
  },

  move: async (id, locationId) => {
    const response = await api.post(`/items/${id}/move`, {
      location_id: locationId
    });
    return response.data;
  },
};