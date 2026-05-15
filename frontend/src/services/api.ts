import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const registerUser = (payload: { name: string; email: string; password: string; role?: string }) =>
  api.post('/auth/register', payload);

export const loginUser = (payload: { email: string; password: string }) => api.post('/auth/login', payload);

export const getProfile = () => api.get('/auth/profile');

export const uploadResume = (formData: FormData, onUploadProgress: (event: ProgressEvent<EventTarget>) => void) =>
  api.post('/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
  });

export default api;
