import axios from 'axios';

// Ensure API URL always ends with /api
const getApiUrl = () => {
  let envUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  
  // Remove trailing slash if present
  envUrl = envUrl.replace(/\/$/, '');
  
  // Always add /api if not already present
  // Check if URL ends with /api (case insensitive)
  if (!envUrl.toLowerCase().endsWith('/api')) {
    envUrl = `${envUrl}/api`;
  }
  
  console.log('🔗 API Base URL configured:', envUrl);
  console.log('🔗 Environment VITE_API_URL:', import.meta.env.VITE_API_URL || 'not set');
  
  return envUrl;
};

const API_URL = getApiUrl();

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests and log requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Log the full URL being called
    const fullUrl = `${config.baseURL}${config.url}`;
    console.log(`📤 Request: ${config.method?.toUpperCase()} ${fullUrl}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

