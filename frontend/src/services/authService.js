import api from './api';

export const login = async (username, password) => {
  try {
    console.log('🔐 Attempting login for:', username);
    const response = await api.post('/auth/login', { username, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
      console.log('✅ Login successful');
    }
    return response.data;
  } catch (error) {
    console.error('❌ Login error:', error.response?.status, error.response?.data || error.message);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

