import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy trang trước đó người dùng định vào (nếu không có thì về trang chủ '/')
  const from = location.state?.from?.pathname || '/';

  const handleMockLogin = (role) => {
    onLogin({ name: role === 'ADMIN' ? 'Quản trị viên' : 'Học viên', role });
    navigate(from, { replace: true });
  };

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto', padding: '24px', border: '1px solid #cbd5e1', borderRadius: '8px' }}>
      <h2>Đăng nhập Hệ thống</h2>
      <p>Chọn quyền đăng nhập thử nghiệm:</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
        <button 
          onClick={() => handleMockLogin('STUDENT')}
          style={{ padding: '10px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Đăng nhập là Học viên (Student)
        </button>

        <button 
          onClick={() => handleMockLogin('ADMIN')}
          style={{ padding: '10px', background: '#ca8a04', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Đăng nhập là Quản trị viên (Admin)
        </button>
      </div>
    </div>
  );
}