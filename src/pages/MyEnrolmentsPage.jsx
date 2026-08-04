import React from 'react';
import { Link } from 'react-router-dom';
import { useBasket } from '../context/BasketContext';

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
            const courseId = course.id || course._id || index;
            return (
              <div
                key={courseId}
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
                    {course.title || course.name}
                  </h3>
                  <p style={{ margin: 0, fontSize: '14px', color: '#16a34a', fontWeight: '600' }}>
                    ✓ Đã đăng ký thành công
                  </p>
                </div>
                <Link
                  to={`/courses/${courseId}`}
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
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}