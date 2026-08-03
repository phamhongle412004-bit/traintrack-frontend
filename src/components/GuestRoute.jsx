import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export function GuestRoute({ user, isLoading }) {
  if (isLoading) {
    return <div className="loading-state">⏳ Đang tải...</div>;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}