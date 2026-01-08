import axios from 'axios';

// In development, use relative path to leverage Vite proxy.
// In production, use the full API URL from environment variables.
const baseURL = import.meta.env.PROD 
  ? `${import.meta.env.VITE_API_URL}/api` 
  : '/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'An error occurred';
    console.error('API Error:', message);
    return Promise.reject(error);
  }
);

export default api;
