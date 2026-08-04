import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:4000/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

export function apiMessage(error) {
  return error.response?.data?.error ?? (error.code === 'ECONNABORTED' ? 'The request timed out.' : 'Unable to connect.');
}

