import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { MainLayout } from './layouts/MainLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';
import { GuestRoute } from './components/GuestRoute';

import CataloguePage from './pages/CataloguePage';
import { CourseDetailPage, CourseOverviewTab, CourseSyllabusTab } from './pages/CourseDetailPage';
import { LoginPage } from './pages/LoginPage';

// Trang Dummy cho các Route còn lại
const LandingPage = () => <div> Trang chủ (Landing Page)</div>;
const BasketPage = () => <div> Giỏ đăng ký khóa học</div>;
const MyEnrolmentsPage = () => <div> Danh sách các khóa học đã đăng ký thành công</div>;
const AdminCoursesPage = () => <div> [Admin] Quản lý danh sách khóa học</div>;
const AdminCourseNewPage = () => <div>[Admin] Tạo khóa học mới</div>;
const AdminCourseEditPage = () => <div>[Admin] Chỉnh sửa khóa học</div>;
const NotFoundPage = () => <div style={{ textAlign: 'center', padding: '60px' }}><h2>404 - Trang không tồn tại</h2></div>;

export default function App() {
  // Mock trạng thái user phiên làm việc
  const [user, setUser] = useState(null); // Structure: { name: string, role: 'STUDENT' | 'ADMIN' }
  const [isLoading, setIsLoading] = useState(false); // Cờ kiểm tra loading session

  return (
    <BrowserRouter>
      <Routes>
        {/* Layout Route chung chứa Header, Nav, Footer & <Outlet/> */}
        <Route path="/" element={<MainLayout user={user} onLogout={() => setUser(null)} />}>
          
          {/* / : Trang chủ */}
          <Route index element={<LandingPage />} />

          {/* /courses : Danh mục khóa học */}
          <Route path="courses" element={<CataloguePage />} />

          {/* /courses/:courseId : Chi tiết & Tab Syllabus (Nested Route) */}
          <Route path="courses/:courseId" element={<CourseDetailPage />}>
            <Route index element={<CourseOverviewTab />} />
            <Route path="syllabus" element={<CourseSyllabusTab />} />
          </Route>

          {/* /basket : Giỏ đăng ký */}
          <Route path="basket" element={<BasketPage />} />

          {/* /login : Trang đăng nhập (Dùng GuestRoute chuyển hướng nếu đã đăng nhập) */}
          <Route 
            path="login" 
            element={
              <GuestRoute user={user} isLoading={isLoading}>
                <LoginPage onLogin={(loggedUser) => setUser(loggedUser)} />
              </GuestRoute>
            } 
          />

          {/* /my-enrolments : Yêu cầu đăng nhập */}
          <Route 
            path="my-enrolments" 
            element={
              <ProtectedRoute user={user} isLoading={isLoading}>
                <MyEnrolmentsPage />
              </ProtectedRoute>
            } 
          />

          {/* các trang Admin : Chỉ dành cho ADMIN */}
          <Route 
            path="admin/courses" 
            element={
              <AdminRoute user={user} isLoading={isLoading}>
                <AdminCoursesPage />
              </AdminRoute>
            } 
          />
          <Route 
            path="admin/courses/new" 
            element={
              <AdminRoute user={user} isLoading={isLoading}>
                <AdminCourseNewPage />
              </AdminRoute>
            } 
          />
          <Route 
            path="admin/courses/:courseId/edit" 
            element={
              <AdminRoute user={user} isLoading={isLoading}>
                <AdminCourseEditPage />
              </AdminRoute>
            } 
          />

          {/* Bất kỳ URL nào khác: Trang 404 */}
          <Route path="*" element={<NotFoundPage />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}