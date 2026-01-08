import api from './axios';

export const carModelApi = {
  // Get all car models with pagination and filters
  getAll: async (params = {}) => {
    const response = await api.get('/car-models', { params });
    return response.data;
  },

  // Get a single car model by ID
  getById: async (id) => {
    const response = await api.get(`/car-models/${id}`);
    return response.data;
  },

  // Create a new car model
  create: async (formData) => {
    const response = await api.post('/car-models', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update an existing car model
  update: async (id, formData) => {
    const response = await api.put(`/car-models/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete a car model
  delete: async (id) => {
    const response = await api.delete(`/car-models/${id}`);
    return response.data;
  },

  // Set default image
  setDefaultImage: async (carModelId, imageId) => {
    const response = await api.patch(`/car-models/${carModelId}/default-image/${imageId}`);
    return response.data;
  },
};

export default carModelApi;



