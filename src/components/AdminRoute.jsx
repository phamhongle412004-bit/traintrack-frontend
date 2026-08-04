import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export function AdminRoute({ user, isLoading, children }) {
  const location = useLocation();

  // 1. Nếu đang tải dữ liệu Auth Session
  if (isLoading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
        ⏳ Đang kiểm tra quyền truy cập...
      </div>
    );
  }

  // 2. Chưa đăng nhập -> Đẩy sang trang /login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Kiểm tra linh hoạt cả user.role lẫn user.isAdmin
  const isAdmin = user.role === 'ADMIN' || user.role === 'admin' || user.isAdmin === true;

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // 4. Trả về children 
  return children;
}