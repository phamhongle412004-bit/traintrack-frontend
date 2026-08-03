import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export function AdminRoute({ user, isLoading }) {
  if (isLoading) {
    return <div className="loading-state">⏳ Đang kiểm tra quyền truy cập...</div>;
  }

  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}