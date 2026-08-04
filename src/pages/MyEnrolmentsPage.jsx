import React from 'react';
import { Link } from 'react-router-dom';

// Import useBasket từ file App.jsx (nếu bạn export từ App.jsx) 
// Hoặc giữ nguyên pathimport của bạn nếu dùng file riêng
import { useBasket } from '../App'; 

export default function MyEnrolmentsPage() {
  const { enrolments } = useBasket();

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>🎓 Khóa học của tôi ({enrolments ? enrolments.length : 0})</h2>

      {!enrolments || enrolments.length === 0 ? (
        <div style={{ padding: '32px', textAlign: 'center', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb', marginTop: '16px' }}>
          <p style={{ color: '#6b7280', marginBottom: '12px', fontSize: '16px' }}>
            Bạn chưa đăng ký khóa học nào.
          </p>
          <Link to="/courses" style={{ color: '#2563eb', fontWeight: 'bold', textDecoration: 'underline' }}>
            Khám phá danh mục khóa học
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '12px', marginTop: '16px' }}>
          {enrolments.map((course, index) => {
            // Đảm bảo luôn lấy đúng ID dạng chuỗi/số của khóa học
            const realId = course.id ?? course._id;

            return (
              <div
                key={realId || index}
                style={{
                  padding: '16px',
                  background: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', color: '#111827' }}>
                    {course.title || course.name || `Khóa học #${index + 1}`}
                  </h3>
                  <p style={{ margin: 0, fontSize: '14px', color: '#16a34a', fontWeight: '600' }}>
                    ✓ Đã đăng ký thành công
                  </p>
                </div>

                {/* Điều hướng tuyệt đối chính xác tới /courses/:courseId */}
                {realId ? (
                  <Link
                    to={`/courses/${realId}`}
                    style={{
                      padding: '8px 16px',
                      background: '#2563eb',
                      color: '#fff',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: 'bold',
                    }}
                  >
                    Vào học ngay
                  </Link>
                ) : (
                  <span style={{ fontSize: '12px', color: '#ef4444' }}>
                    Lỗi: Khóa học thiếu ID
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}