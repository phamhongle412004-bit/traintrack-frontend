import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export function ProtectedRoute({ user, isLoading }) {
  const location = useLocation();

  if (isLoading) {
    return <div className="loading-state">⏳ Đang xác thực phiên làm việc...</div>;
  }

  if (!user) {
    // Chuyển hướng tới /login, đính kèm state.from để sau khi login sẽ quay lại
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}