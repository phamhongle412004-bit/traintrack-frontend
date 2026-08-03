import React from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';

export function MainLayout({ user, onLogout }) {
  return (
    <div className="app-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* HEADER & NAVIGATION */}
      <header style={{ background: '#1e293b', color: '#fff', padding: '1rem 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '1.5rem' }}>
            <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>🎓 TrainTrack</Link>
          </h1>

          <nav style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <NavLink to="/" end style={({ isActive }) => ({ color: isActive ? '#38bdf8' : '#fff', textDecoration: 'none' })}>Trang chủ</NavLink>
            <NavLink to="/courses" style={({ isActive }) => ({ color: isActive ? '#38bdf8' : '#fff', textDecoration: 'none' })}>Danh mục</NavLink>
            <NavLink to="/basket" style={({ isActive }) => ({ color: isActive ? '#38bdf8' : '#fff', textDecoration: 'none' })}>Giỏ đăng ký</NavLink>

            {user && (
              <NavLink to="/my-enrolments" style={({ isActive }) => ({ color: isActive ? '#38bdf8' : '#fff', textDecoration: 'none' })}>Khóa học của tôi</NavLink>
            )}

            {user?.role === 'ADMIN' && (
              <NavLink to="/admin/courses" style={({ isActive }) => ({ color: isActive ? '#facc15' : '#fff', textDecoration: 'none', fontWeight: 'bold' })}>Admin</NavLink>
            )}

            {user ? (
              <div style={{ marginLeft: '12px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem' }}>👤 {user.name}</span>
                <button onClick={onLogout} style={{ cursor: 'pointer', padding: '4px 8px' }}>Đăng xuất</button>
              </div>
            ) : (
              <Link to="/login" style={{ background: '#0284c7', color: '#fff', padding: '6px 12px', borderRadius: '4px', textDecoration: 'none' }}>Đăng nhập</Link>
            )}
          </nav>
        </div>
      </header>

      {/* CONTENT INNER (Renders matching child route) */}
      <main style={{ flex: 1, padding: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer style={{ background: '#0f172a', color: '#94a3b8', textAlign: 'center', padding: '1rem', marginTop: 'auto' }}>
        <p style={{ margin: 0 }}>© TrainTrack Learning Management System.</p>
      </footer>
    </div>
  );
}