import { apiClient } from './client';

export function loginApi(credentials) {
  return apiClient('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export function getMeApi() {
  return apiClient('/auth/me');
}