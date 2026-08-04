import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useBasket } from '../context/BasketContext';

export default function BasketPage() {
  const { items, itemCount, removeFromBasket, clearBasket, submitBasket } = useBasket();
  const navigate = useNavigate();

  const handleSubmitEnrolment = async () => {
    if (items.length === 0) return;

    const result = await submitBasket();
    if (result.success) {
      alert('Đăng ký khóa học thành công! Giỏ hàng đã được làm rỗng.');
      navigate('/my-enrolments');
    } else {
      alert(`Đăng ký thất bại: ${result.error || 'Có lỗi xảy ra'}`);
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Giỏ đăng ký khóa học ({itemCount})</h2>

      {items.length === 0 ? (
        <div style={{ padding: '32px', textAlign: 'center', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb', marginTop: '16px' }}>
          <p style={{ fontSize: '18px', marginBottom: '12px', color: '#4b5563' }}>Giỏ hàng của bạn đang trống.</p>
          <Link to="/courses" style={{ color: '#2563eb', fontWeight: 'bold', textDecoration: 'underline' }}>
            Quay lại danh mục để chọn khóa học
          </Link>
        </div>
      ) : (
        <div style={{ marginTop: '20px' }}>
          <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden', background: '#fff' }}>
            {items.map((course) => {
              const courseId = course.id || course._id;
              return (
                <div
                  key={courseId}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px',
                    borderBottom: '1px solid #e5e7eb',
                  }}
                >
                  <div>
                    <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', color: '#111827' }}>
                      {course.title || course.name}
                    </h3>
                    <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
                      Cấp độ: {course.level || 'Tất cả'} {course.fee ? `| Học phí: ${Number(course.fee).toLocaleString()} VNĐ` : ''}
                    </p>
                  </div>

                  <button
                    onClick={() => removeFromBasket(courseId)}
                    style={{
                      padding: '6px 12px',
                      background: '#fee2e2',
                      color: '#dc2626',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                    }}
                  >
                    Xóa
                  </button>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
            <button
              onClick={clearBasket}
              style={{
                padding: '10px 18px',
                background: '#fff',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '500',
              }}
            >
              Làm rỗng giỏ
            </button>

            <button
              onClick={handleSubmitEnrolment}
              style={{
                padding: '10px 24px',
                background: '#16a34a',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '16px',
              }}
            >
              Xác nhận đăng ký ({itemCount} khóa học)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}