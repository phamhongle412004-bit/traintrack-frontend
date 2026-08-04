import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams, Link } from 'react-router-dom';

import { MainLayout } from './layouts/MainLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';
import { GuestRoute } from './components/GuestRoute';

import CataloguePage from './pages/CataloguePage';
import { CourseDetailPage, CourseOverviewTab, CourseSyllabusTab } from './pages/CourseDetailPage';

import { LoginForm } from './components/LoginForm';
import { CourseForm } from './components/CourseForm';

const LandingPage = () => (
  <div className="p-8 text-center space-y-4">
    <h1 className="text-3xl font-bold">Chào mừng tới TrainTrack</h1>
    <p className="text-gray-600">Hệ thống quản lý và đăng ký khóa học dành cho học viên & admin.</p>
    <div className="space-x-4">
      <Link to="/courses" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Xem khóa học</Link>
      <Link to="/login" className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">Đăng nhập</Link>
    </div>
  </div>
);

const BasketPage = () => <div className="p-8"><h2 className="text-xl font-bold">Giỏ đăng ký khóa học</h2></div>;
const MyEnrolmentsPage = () => <div className="p-8"><h2 className="text-xl font-bold">Khóa học đã đăng ký</h2></div>;

const AdminCoursesPage = () => (
  <div className="p-8 space-y-4">
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-bold">[Admin] Quản lý khóa học</h2>
      <Link to="/admin/courses/new" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
        + Thêm khóa học mới
      </Link>
    </div>
    <p className="text-gray-500">Danh sách các khóa học hiện có trong hệ thống...</p>
  </div>
);

const NotFoundPage = () => (
  <div className="p-12 text-center space-y-4">
    <h2 className="text-3xl font-bold text-red-600">404 - Trang không tồn tại</h2>
    <Link to="/" className="text-blue-600 underline">Quay về trang chủ</Link>
  </div>
);

// --- A. Trang Đăng Nhập (/login) ---
const LoginPageWrapper = ({ onLogin }) => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    // Giả lập lưu user Admin vào state khi login thành công
    const loggedUser = { name: 'Admin User', role: 'ADMIN' };
    onLogin(loggedUser);
    alert('Đăng nhập thành công với quyền ADMIN!');
    navigate('/admin/courses'); // Đăng nhập xong tự động qua trang quản lý Admin
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <LoginForm onLoginSuccess={handleSuccess} />
    </div>
  );
};

// --- B. Trang Admin Thêm Khóa Học Mới (/admin/courses/new) ---
const AdminCourseNewPageWrapper = () => {
  const [instructors, setInstructors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3001/api/instructors')
      .then((res) => res.json())
      .then((data) => setInstructors(data))
      .catch((err) => console.error('Lỗi khi tải danh sách giảng viên:', err));
  }, []);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <CourseForm 
        instructors={instructors} 
        onSubmitSuccess={() => {
          alert('Tạo khóa học thành công!');
          navigate('/admin/courses');
        }} 
      />
    </div>
  );
};

// --- C. Trang Admin Chỉnh Sửa Khóa Học (/admin/courses/:courseId/edit) ---
const AdminCourseEditPageWrapper = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      fetch(`http://localhost:3001/api/courses/${courseId}`).then((r) => r.json()),
      fetch('http://localhost:3001/api/instructors').then((r) => r.json())
    ])
    .then(([courseData, instructorsData]) => {
      setCourse(courseData);
      setInstructors(instructorsData);
    })
    .catch((err) => console.error('Lỗi khi tải dữ liệu sửa khóa học:', err))
    .finally(() => setLoading(false));
  }, [courseId]);

  if (loading) return <div className="p-8 text-center text-gray-500">Đang tải thông tin khóa học...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <CourseForm 
        initialData={course} 
        instructors={instructors} 
        onSubmitSuccess={() => {
          alert('Cập nhật khóa học thành công!');
          navigate('/admin/courses');
        }} 
      />
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState(null); // { name: string, role: 'STUDENT' | 'ADMIN' }
  const [isLoading] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout user={user} onLogout={() => setUser(null)} />}>
          
          {/* Public Routes */}
          <Route index element={<LandingPage />} />
          <Route path="courses" element={<CataloguePage />} />

          {/* Nested Routes Chi tiết khóa học */}
          <Route path="courses/:courseId" element={<CourseDetailPage />}>
            <Route index element={<CourseOverviewTab />} />
            <Route path="syllabus" element={<CourseSyllabusTab />} />
          </Route>

          <Route path="basket" element={<BasketPage />} />

          {/* Guest Route: Đăng nhập */}
          <Route 
            path="login" 
            element={
              <GuestRoute user={user} isLoading={isLoading}>
                <LoginPageWrapper onLogin={(loggedUser) => setUser(loggedUser)} />
              </GuestRoute>
            } 
          />

          {/* Protected Route: Dành cho học viên */}
          <Route 
            path="my-enrolments" 
            element={
              <ProtectedRoute user={user} isLoading={isLoading}>
                <MyEnrolmentsPage />
              </ProtectedRoute>
            } 
          />

          {/* Admin Routes: Dành cho quản trị viên */}
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
                <AdminCourseNewPageWrapper />
              </AdminRoute>
            } 
          />
          <Route 
            path="admin/courses/:courseId/edit" 
            element={
              <AdminRoute user={user} isLoading={isLoading}>
                <AdminCourseEditPageWrapper />
              </AdminRoute>
            } 
          />

          {/* Trang 404 */}
          <Route path="*" element={<NotFoundPage />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}