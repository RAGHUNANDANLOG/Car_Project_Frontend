import api from './axios';

export const commissionApi = {
  // Get commission report
  getReport: async (params = {}) => {
    const response = await api.get('/commission/report', { params });
    return response.data;
  },

  // Get all salesmen
  getSalesmen: async () => {
    const response = await api.get('/commission/salesmen');
    return response.data;
  },

  // Get commission rules
  getRules: async () => {
    const response = await api.get('/commission/rules');
    return response.data;
  },

  // Export CSV
  exportCSV: async (params = {}) => {
    const response = await api.get('/commission/export', {
      params,
      responseType: 'blob',
    });
    return response.data;
  },
};

export default commissionApi;



