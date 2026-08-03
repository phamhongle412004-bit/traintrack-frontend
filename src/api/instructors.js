import { apiClient } from './client';

export function getInstructorsApi(signal) {
  return apiClient('/instructors', { signal });
}