const BASE_URL = 'http://localhost:3001/api';

class APIError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
  }
}

export async function apiClient(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  // Xử lý riêng cho 204 No Content (Tránh lỗi parse JSON trên body rỗng)
  if (response.status === 204) {
    return null;
  }

  let data;
  try {
    data = await response.json();
  } catch (err) {
    data = null;
  }

  // Ném ra Error cho mọi mã trạng thái HTTP không thuộc dải 2xx
  if (!response.ok) {
    const errorMessage = data?.error || data?.message || `Lỗi yêu cầu: ${response.statusText}`;
    throw new APIError(errorMessage, response.status, data);
  }

  return data;
}