import React from 'react';
import { useParams, NavLink, Outlet } from 'react-router-dom';

export function CourseDetailPage() {
  const { courseId } = useParams();

  return (
    <div>
      <h2>Chi tiết khóa học: {courseId}</h2>

      {/* Tabs chuyển đổi giữa Tổng quan và Giáo trình */}
      <div style={{ display: 'flex', gap: '16px', borderBottom: '2px solid #e2e8f0', marginBottom: '20px' }}>
        <NavLink
          to=""
          end
          style={({ isActive }) => ({
            padding: '10px 16px',
            textDecoration: 'none',
            fontWeight: isActive ? 'bold' : 'normal',
            borderBottom: isActive ? '3px solid #0284c7' : 'none',
            color: isActive ? '#0284c7' : '#64748b'
          })}
        >
          Tổng quan
        </NavLink>
        <NavLink
          to="syllabus"
          style={({ isActive }) => ({
            padding: '10px 16px',
            textDecoration: 'none',
            fontWeight: isActive ? 'bold' : 'normal',
            borderBottom: isActive ? '3px solid #0284c7' : 'none',
            color: isActive ? '#0284c7' : '#64748b'
          })}
        >
          Giáo trình (Syllabus)
        </NavLink>
      </div>

      {/* Nơi render tab con */}
      <Outlet />
    </div>
  );
}

// Tab Tổng quan (Mặc định)
export function CourseOverviewTab() {
  return (
    <div>
      <h3>Tổng quan khóa học</h3>
      <p>Nội dung giới thiệu chi tiết, mục tiêu khóa học và thông tin giảng viên...</p>
    </div>
  );
}

// Tab Giáo trình (Nested route: /courses/:courseId/syllabus)
export function CourseSyllabusTab() {
  return (
    <div>
      <h3> Giáo trình & Lộ trình học</h3>
      <ul>
        <li>Chương 1: Kiến thức nền tảng</li>
        <li>Chương 2: Thực hành dự án thực tế</li>
        <li>Chương 3: Kiểm tra & Tổng kết</li>
      </ul>
    </div>
  );
}