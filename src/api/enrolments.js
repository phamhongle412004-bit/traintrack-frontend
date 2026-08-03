import { apiClient } from './client';

export function getMyEnrolmentsApi(signal) {
  return apiClient('/enrolments', { signal });
}

export function createEnrolmentApi(courseIds) {
  return apiClient('/enrolments', {
    method: 'POST',
    body: JSON.stringify({ courseIds }),
  });
}

export function deleteEnrolmentApi(id) {
  return apiClient(`/enrolments/${id}`, {
    method: 'DELETE',
  });
}