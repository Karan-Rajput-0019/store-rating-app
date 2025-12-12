import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: '/api', // This will be proxied to http://localhost:5000
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors (e.g., 401 Unauthorized)
    if (error.response?.status === 401) {
      // Handle unauthorized access (e.g., redirect to login)
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API methods
export const auth = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/me'),
};

export const stores = {
  getAll: () => api.get('/stores'),
  getById: (id) => api.get(`/stores/${id}`),
  create: (storeData) => api.post('/stores', storeData),
  update: (id, storeData) => api.put(`/stores/${id}`, storeData),
  delete: (id) => api.delete(`/stores/${id}`),
};

export const ratings = {
  create: (storeId, ratingData) => api.post(`/stores/${storeId}/ratings`, ratingData),
  update: (storeId, ratingId, ratingData) => 
    api.put(`/stores/${storeId}/ratings/${ratingId}`, ratingData),
  delete: (storeId, ratingId) => 
    api.delete(`/stores/${storeId}/ratings/${ratingId}`),
};

export default api;
