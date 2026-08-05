import axios from 'axios';
import { getValidSession, supabase } from './supabase';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async (config) => {
  if (!supabase) return config;
  const session = await getValidSession();
  if (session?.access_token) config.headers.Authorization = `Bearer ${session.access_token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const request = error.config;
    if (error.response?.status === 503 && request?.method?.toLowerCase() === 'get' && !request._serviceRetry) {
      request._serviceRetry = true;
      await new Promise((resolve) => setTimeout(resolve, 1_000));
      return api(request);
    }
    if (error.response?.status === 401 && supabase && request && !request._authRetry) {
      request._authRetry = true;
      const session = await getValidSession(true);
      if (session?.access_token) {
        request.headers.Authorization = `Bearer ${session.access_token}`;
        return api(request);
      }
    }
    if (error.response?.status === 401) window.dispatchEvent(new Event('promptly:unauthorized'));
    return Promise.reject(error);
  },
);

export function apiMessage(error) {
  return error.response?.data?.error ?? (error.code === 'ECONNABORTED' ? 'The request timed out.' : 'Unable to connect to the Promptly API.');
}
