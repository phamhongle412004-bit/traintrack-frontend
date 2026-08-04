const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

/**
 * Helper nội bộ để thực hiện request và xử lý lỗi tập trung
 */
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // 1. 204 No Content không được parse JSON
  if (response.status === 204) {
    return null;
  }

  let data = null;
  try {
    data = await response.json();
  } catch (err) {
    // Không có body hoặc body không phải JSON
  }

  // 2. Phản hồi non-2xx phải throw Error chứa status code
  if (!response.ok) {
    const errorMessage = data?.error || data?.message || `Yêu cầu thất bại với mã lỗi ${response.status}`;
    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

/**
 * 1. Lấy danh sách khóa học kèm bộ lọc
 */
export async function getCourses(params = {}, signal) {
  const cleanParams = {};
  if (params.q) cleanParams.q = params.q.trim();
  if (params.level && params.level !== 'ALL') cleanParams.level = params.level;
  if (params.sort) cleanParams.sort = params.sort;
  if (params.order) cleanParams.order = params.order;

  const query = new URLSearchParams(cleanParams).toString();
  const endpoint = query ? `/courses?${query}` : '/courses';

  return request(endpoint, { signal });
}

/**
 * 2. Lấy chi tiết 1 khóa học theo ID
 */
export async function getCourseById(id, signal) {
  return request(`/courses/${id}`, { signal });
}

/**
 * 3. Tạo khóa học mới (ADMIN)
 */
export async function createCourse(courseData) {
  return request('/courses', {
    method: 'POST',
    body: JSON.stringify(courseData),
  });
}

/**
 * 4. Cập nhật thông tin khóa học (ADMIN)
 */
export async function updateCourse(id, courseData) {
  return request(`/courses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(courseData),
  });
}

/**
 * 5. Xóa khóa học (ADMIN)
 */
export async function deleteCourse(id) {
  return request(`/courses/${id}`, {
    method: 'DELETE',
  });
}

/**
 * 6. Lấy danh sách giảng viên (ADMIN / FORM)
 */
export async function getInstructors(signal) {
  return request('/instructors', { signal });
}