import { refreshToken } from './auth';
import { Shift, User } from '../components/Calendar/types';

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

export const getUsers = async (): Promise<User[]> => {
  const response = await fetchWithAuth(`${API_URL}/api/users/`);
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  const data = await response.json();
  return data.results || data;
};

export const createUser = async (user: Omit<User, 'id'>): Promise<User> => {
  const response = await fetchWithAuth(`${API_URL}/api/users/`, {
    method: 'POST',
    body: JSON.stringify(user),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create user');
  }
  
  return response.json();
};

export const updateUser = async (id: number, user: Partial<User>): Promise<User> => {
  const response = await fetchWithAuth(`${API_URL}/api/users/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(user),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update user');
  }
  
  return response.json();
};

export const deleteUser = async (id: number): Promise<void> => {
  const response = await fetchWithAuth(`${API_URL}/api/users/${id}/`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete user');
  }
};

export const createShift = async (shift: Omit<Shift, 'id'>): Promise<Shift> => {
  const response = await fetchWithAuth(`${API_URL}/api/shifts/`, {
    method: 'POST',
    body: JSON.stringify(shift),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create shift');
  }
  
  return response.json();
};

export const updateShift = async (id: number, shift: Partial<Shift>): Promise<Shift> => {
  const response = await fetchWithAuth(`${API_URL}/api/shifts/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(shift),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update shift');
  }
  
  return response.json();
};

export const deleteShift = async (id: number): Promise<void> => {
  const response = await fetchWithAuth(`${API_URL}/api/shifts/${id}/`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete shift');
  }
};

export const assignUserToShift = async (shiftId: number, userId: number): Promise<Shift> => {
  const response = await fetchWithAuth(`${API_URL}/api/shifts/${shiftId}/assign_user/`, {
    method: 'POST',
    body: JSON.stringify({ user_id: userId }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to assign user to shift');
  }
  
  return response.json();
};