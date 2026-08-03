const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// 1. Fetch danh sách khóa học kèm bộ lọc
export async function getCourses(params = {}) {
  // Loại bỏ các giá trị rỗng/mặc định trước khi tạo query string
  const cleanParams = {};
  if (params.q) cleanParams.q = params.q;
  if (params.level && params.level !== 'ALL') cleanParams.level = params.level;
  if (params.sort) cleanParams.sort = params.sort;
  if (params.order) cleanParams.order = params.order;

  const query = new URLSearchParams(cleanParams).toString();
  const url = query ? `${API_BASE_URL}/courses?${query}` : `${API_BASE_URL}/courses`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Lỗi tải khóa học: ${res.status}`);
  return res.json();
}

// 2. Fetch danh sách giảng viên
export async function getInstructors() {
  const res = await fetch(`${API_BASE_URL}/instructors`);
  if (!res.ok) throw new Error(`Lỗi tải giảng viên: ${res.status}`);
  return res.json();
}