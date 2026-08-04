import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

export function MainLayout({ user, onLogout }) {
  return (
    <div>
      {/* Header Navigation */}
      <header style={{ background: '#1e293b', padding: '12px 24px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 'bold', fontSize: '20px' }}>🎓 TrainTrack</div>
        
        <nav style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <NavLink to="/" end style={({ isActive }) => ({ color: isActive ? '#38bdf8' : '#fff', textDecoration: 'none' })}>
            Trang chủ
          </NavLink>

          {/*THÊM 'end' VÀO ĐÂY ĐỂ KHÔNG BỊ DÍNH SÁNG MÀU KHI VÀO /courses/:courseId */}
          <NavLink to="/courses" end style={({ isActive }) => ({ color: isActive ? '#38bdf8' : '#fff', textDecoration: 'none' })}>
            Danh mục
          </NavLink>

          <NavLink to="/basket" style={({ isActive }) => ({ color: isActive ? '#38bdf8' : '#fff', textDecoration: 'none' })}>
            Giỏ đăng ký
          </NavLink>

          <NavLink to="/my-enrolments" style={({ isActive }) => ({ color: isActive ? '#38bdf8' : '#fff', textDecoration: 'none' })}>
            Khóa học của tôi
          </NavLink>

          {(user?.role === 'ADMIN' || user?.isAdmin) && (
            <NavLink to="/admin/courses" style={({ isActive }) => ({ color: isActive ? '#38bdf8' : '#fff', textDecoration: 'none' })}>
              Admin
            </NavLink>
          )}
        </nav>

        <div>
          {user ? (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <span>👤 {user.fullName || user.username}</span>
              <button onClick={onLogout} style={{ padding: '6px 12px', borderRadius: '4px' }}>Đăng xuất</button>
            </div>
          ) : (
            <NavLink to="/login" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>
              Đăng nhập
            </NavLink>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main style={{ minHeight: 'calc(100vh - 120px)', padding: '20px' }}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer style={{ padding: '16px', textAlign: 'center', background: '#f1f5f9', borderTop: '1px solid #e2e8f0' }}>
        © TrainTrack - Khóa học trực tuyến
      </footer>
    </div>
  );
}