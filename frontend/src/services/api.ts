import axios, { AxiosProgressEvent } from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'https://backend-lovat-five-15.vercel.app/api';

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

export const uploadResume = (formData: FormData, onUploadProgress: (event: AxiosProgressEvent) => void) =>
  api.post('/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
  });

export const generateQuestions = (payload: { role?: string; skills?: string[]; resumeText?: string }) =>
  api.post('/ai/generate-questions', payload);

export const evaluateAnswer = (payload: { question: string; answer: string; role?: string }) =>
  api.post('/ai/evaluate-answer', payload);

// New Persisted Interview Endpoints
export const startInterview = (payload: {
  role: string;
  skills: string[];
  resumeText: string;
  difficulty: string;
  type: string;
  company?: string;
  count: number;
}) => api.post('/interviews/start', payload);

export const submitInterviewAnswer = (
  id: string,
  payload: { questionIndex: number; answer: string }
) => api.post(`/interviews/${id}/submit-answer`, payload);

export const finishInterview = (id: string) => api.post(`/interviews/${id}/finish`);

export const getInterviews = () => api.get('/interviews');

export const getInterviewDetails = (id: string) => api.get(`/interviews/${id}`);

export const getLeaderboard = () => api.get('/interviews/leaderboard');

export const getCareerMatch = (payload: { skills: string[]; interviews: any[] }) =>
  api.post('/ai/career-match', payload);

export const getSkillTutorial = (payload: { skillName: string }) =>
  api.post('/ai/skill-tutor', payload);

export const forgotPassword = (payload: { email: string }) =>
  api.post('/auth/forgot-password', payload);

export const verifyOtp = (payload: { email: string; otp: string }) =>
  api.post('/auth/verify-otp', payload);

export const resetPassword = (payload: { email: string; otp: string; newPassword: string }) =>
  api.post('/auth/reset-password', payload);

export default api;
