const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export async function getCourses(params = {}, signal) {
  // 1. Lọc sạch các params rỗng
  const cleanParams = {};
  if (params.q) cleanParams.q = params.q.trim();
  if (params.level && params.level !== 'ALL') cleanParams.level = params.level;
  if (params.sort) cleanParams.sort = params.sort;
  if (params.order) cleanParams.order = params.order;

  const query = new URLSearchParams(cleanParams).toString();
  const url = query ? `${API_BASE_URL}/courses?${query}` : `${API_BASE_URL}/courses`;

  // 2. Lấy token từ localStorage (nếu có)
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  // 3. Gọi fetch đính kèm signal để Abort
  const res = await fetch(url, { headers, signal });

  // 4. Xử lý phản hồi rỗng (204 No Content)
  if (res.status === 204) return null;

  // 5. Bắt lỗi không thuộc dải 2xx chuẩn chỉnh
  if (!res.ok) {
    let errorData;
    try {
      errorData = await res.json();
    } catch {
      errorData = null;
    }
    const message = errorData?.error || errorData?.message || `Lỗi tải khóa học: ${res.status}`;
    const err = new Error(message);
    err.status = res.status;
    err.data = errorData;
    throw err;
  }

  return res.json();
}

/**
 * 2. Fetch danh sách giảng viên
 * @param {AbortSignal} [signal]
 */
export async function getInstructors(signal) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const res = await fetch(`${API_BASE_URL}/instructors`, { headers, signal });

  if (res.status === 204) return null;

  if (!res.ok) {
    let errorData;
    try {
      errorData = await res.json();
    } catch {
      errorData = null;
    }
    const message = errorData?.error || errorData?.message || `Lỗi tải giảng viên: ${res.status}`;
    const err = new Error(message);
    err.status = res.status;
    err.data = errorData;
    throw err;
  }

  return res.json();
}