import React, { useState, useEffect, useCallback } from 'react';
import { getCoursesApi, deleteCourseApi } from '../api/courses';
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
        setError(err.message);
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
      // Cập nhật UI ngay lập tức sau khi xóa thành công trên API
      setCourses((prev) => prev.filter((c) => c.id !== courseId));
    } catch (err) {
      if (err.status === 409) {
        setActionError('Không thể xóa khóa học này vì đã có học viên đăng ký!');
      } else {
        setActionError(err.message || 'Lỗi khi xóa khóa học.');
      }
    }
  };

  return (
    <div>
      <h2>⚙️ [Admin] Quản lý khóa học</h2>

      {actionError && (
        <div style={{ padding: '12px', background: '#fee2e2', color: '#b91c1c', borderRadius: '4px', marginBottom: '16px' }}>
          ⚠️ {actionError}
        </div>
      )}

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
            {courses.map((course) => (
              <tr key={course.id}>
                <td style={{ padding: '12px', border: '1px solid #cbd5e1' }}>{course.id}</td>
                <td style={{ padding: '12px', border: '1px solid #cbd5e1' }}>{course.title}</td>
                <td style={{ padding: '12px', border: '1px solid #cbd5e1' }}>${course.price}</td>
                <td style={{ padding: '12px', border: '1px solid #cbd5e1' }}>
                  <button 
                    onClick={() => handleDelete(course.id, course.title)} 
                    style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </AsyncDataWrapper>
    </div>
  );
}