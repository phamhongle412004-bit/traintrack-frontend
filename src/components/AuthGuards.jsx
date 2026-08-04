import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// 1. ProtectedRoute: Bắt buộc đăng nhập (Dành cho /my-enrolments)
export function ProtectedRoute({ user, isLoading, children }) {
  const location = useLocation();

  //Chống FLASH trang Login: Khi đang kiểm tra session thì hiển thị Loading
  if (isLoading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Đang xác thực tài khoản...</div>;
  }

  // Nếu chưa đăng nhập -> Chuyển hướng sang /login VÀ lưu trang hiện tại vào state.from
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

// 2. AdminRoute: Bắt buộc đăng nhập VÀ phải có quyền ADMIN
export function AdminRoute({ user, isLoading, children }) {
  const location = useLocation();

  if (isLoading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Đang kiểm tra quyền hạn...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Kiểm tra quyền Admin (Tùy cấu trúc object user của bạn, ví dụ user.role hoặc user.isAdmin)
  const isAdmin = user.role === 'ADMIN' || user.isAdmin === true;
  if (!isAdmin) {
    return <Navigate to="/" replace />; // Không phải Admin thì đẩy về trang chủ
  }

  return children;
}

// 3. GuestRoute: Dành cho trang /login (Người ĐÃ đăng nhập không được vào lại /login)
export function GuestRoute({ user, isLoading, children }) {
  if (isLoading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Đang kiểm tra session...</div>;
  }

  // Đã đăng nhập rồi mà cố truy cập /login -> Đẩy về trang chủ
  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
}