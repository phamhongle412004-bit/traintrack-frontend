import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export function GuestRoute({ user, isLoading, children }) {
  if (isLoading) {
    return <div className="loading-state p-8 text-center">⏳ Đang tải...</div>;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
}