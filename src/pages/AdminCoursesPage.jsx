import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom'; // 💡 Bổ sung Link để chuyển trang
import { getCourses as getCoursesApi, deleteCourse as deleteCourseApi } from '../api/courses';
import { AsyncDataWrapper } from '../components/AsyncDataWrapper';

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);

  const loadData = useCallback((signal) => {
    setLoading(true);
    setError(null);
    getCoursesApi({}, signal)
      .then((data) => {
        setCourses(data || []);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setError(err.message || 'Không thể kết nối đến máy chủ');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadData(controller.signal);
    return () => controller.abort();
  }, [loadData]);

  const handleDelete = async (courseId, courseTitle) => {
    setActionError(null);
    const confirmed = window.confirm(`Bạn có chắc chắn muốn xóa khóa học "${courseTitle}"?`);
    if (!confirmed) return;

    try {
      await deleteCourseApi(courseId);
      // 💡 Sửa: Hỗ trợ cả id lẫn _id
      setCourses((prev) => prev.filter((c) => (c.id || c._id) !== courseId));
    } catch (err) {
      if (err.status === 409) {
        setActionError('Không thể xóa khóa học này vì đã có học viên đăng ký!');
      } else {
        setActionError(err.message || 'Lỗi khi xóa khóa học.');
      }
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* HEADER: Tiêu đề + Nút Tạo mới */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>⚙️ [Admin] Quản lý khóa học</h2>
        <Link 
          to="/admin/courses/new" 
          style={{ background: '#16a34a', color: '#fff', padding: '8px 16px', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' }}
        >
          + Thêm khóa học mới
        </Link>
      </div>

      {/* Thông báo lỗi thao tác (Action Error) */}
      {actionError && (
        <div style={{ padding: '12px', background: '#fee2e2', color: '#b91c1c', borderRadius: '4px', marginBottom: '16px' }}>
          ⚠️ {actionError}
        </div>
      )}

      {/* WRAPPER RENDER 4 TRẠNG THÁI */}
      <AsyncDataWrapper 
        loading={loading} 
        error={error} 
        isEmpty={courses.length === 0} 
        onRetry={() => loadData()}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
          <thead>
            <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
              <th style={{ padding: '12px', border: '1px solid #cbd5e1' }}>ID</th>
              <th style={{ padding: '12px', border: '1px solid #cbd5e1' }}>Tên khóa học</th>
              <th style={{ padding: '12px', border: '1px solid #cbd5e1' }}>Giá</th>
              <th style={{ padding: '12px', border: '1px solid #cbd5e1' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => {
              const targetId = course.id || course._id;
              return (
                <tr key={targetId}>
                  <td style={{ padding: '12px', border: '1px solid #cbd5e1' }}>{targetId}</td>
                  <td style={{ padding: '12px', border: '1px solid #cbd5e1' }}>{course.title}</td>
                  <td style={{ padding: '12px', border: '1px solid #cbd5e1' }}>${course.price}</td>
                  <td style={{ padding: '12px', border: '1px solid #cbd5e1', gap: '8px', display: 'flex' }}>
                    {/* Nút Chỉnh sửa */}
                    <Link 
                      to={`/admin/courses/${targetId}/edit`}
                      style={{ background: '#2563eb', color: '#fff', padding: '6px 12px', borderRadius: '4px', textDecoration: 'none', fontSize: '14px' }}
                    >
                      Sửa
                    </Link>

                    {/* Nút Xóa */}
                    <button 
                      onClick={() => handleDelete(targetId, course.title)} 
                      style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </AsyncDataWrapper>
    </div>
  );
}