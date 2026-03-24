import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Auth ──────────────────────────────────────────────────────────────────────
export const register = (data) => api.post('/auth/register', data);
export const login = (username, password) => {
  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);
  return api.post('/auth/token', formData);
};
export const getMe = () => api.get('/auth/me');

// ── Schedules ─────────────────────────────────────────────────────────────────
export const getSchedules = () => api.get('/schedules');
export const createSchedule = (data) => api.post('/schedules', data);
export const updateSchedule = (id, data) => api.put(`/schedules/${id}`, data);
export const deleteSchedule = (id) => api.delete(`/schedules/${id}`);

// ── Share ─────────────────────────────────────────────────────────────────────
export const createShareLink = () => api.post('/share');
export const getSharedTimetable = (token) => api.get(`/share/${token}`);

// ── AI (with conversation history) ───────────────────────────────────────────
export const chatWithAI = (message, messages = []) =>
  api.post('/ai/chat', { message, messages });

// ── Profile ───────────────────────────────────────────────────────────────────
export const getProfile = () => api.get('/profile');
export const updateProfile = (data) => api.put('/profile', data);

// ── Exams ─────────────────────────────────────────────────────────────────────
export const getExams = () => api.get('/exams');
export const createExam = (data) => api.post('/exams', data);
export const deleteExam = (id) => api.delete(`/exams/${id}`);
