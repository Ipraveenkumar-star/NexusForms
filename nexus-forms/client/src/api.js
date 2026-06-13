import axios from 'axios';

// ⬇️ CHANGE THIS to your actual Render URL
const RENDER_URL = 'https://nexusforms-0cka.onrender.com';

const baseURL = process.env.REACT_APP_API_URL || RENDER_URL;

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nf_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      const url = err.config?.url || '';
      if (!url.includes('/auth/')) {
        localStorage.removeItem('nf_token');
        localStorage.removeItem('nf_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export default api;