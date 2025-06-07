import { refreshToken } from './auth';
import { Shift } from '../components/Calendar/types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('No authentication token');
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (response.status === 401) {
    // Token expired, try to refresh
    try {
      const newToken = await refreshToken();
      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${newToken}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      throw new Error('Authentication failed');
    }
  }

  return response;
};

export const getShifts = async (): Promise<Shift[]> => {
  const response = await fetchWithAuth(`${API_URL}/api/shifts/`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch shifts');
  }

  const data = await response.json();
  return data.results || data;
};