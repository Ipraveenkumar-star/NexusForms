import axios from 'axios';

// In development: uses proxy (localhost:5000)
// In production (Vercel): uses REACT_APP_API_URL env variable
const baseURL = process.env.REACT_APP_API_URL || '';

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nf_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If token expired, redirect to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('nf_token');
      localStorage.removeItem('nf_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
