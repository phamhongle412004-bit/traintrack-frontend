import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams, Link } from 'react-router-dom';

import { MainLayout } from './layouts/MainLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';
import { GuestRoute } from './components/GuestRoute';

import CataloguePage from './pages/CataloguePage';
import { CourseDetailPage, CourseOverviewTab, CourseSyllabusTab } from './pages/CourseDetailPage';

import { LoginForm } from './components/LoginForm';
import { CourseForm } from './components/CourseForm';

import BasketPage from './pages/BasketPage';
import MyEnrolmentsPage from './pages/MyEnrolmentsPage';

import { useAuth } from './context/AuthContext';

// ==========================================
// 1. BASKET CONTEXT
// ==========================================
const BasketContext = createContext(null);

const BASKET_STORAGE_KEY = 'traintrack_basket';
const ENROLMENTS_STORAGE_KEY = 'traintrack_my_enrolments';

export function BasketProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(BASKET_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [enrolments, setEnrolments] = useState(() => {
    try {
      const saved = localStorage.getItem(ENROLMENTS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(BASKET_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem(ENROLMENTS_STORAGE_KEY, JSON.stringify(enrolments));
  }, [enrolments]);

  const addToBasket = (course) => {
    if (!course) return;
    setItems((prevItems) => {
      const courseId = course.id || course._id;
      const exists = prevItems.some((item) => (item.id || item._id) === courseId);
      if (exists) return prevItems;
      return [...prevItems, course];
    });
  };

  const removeFromBasket = (courseId) => {
    setItems((prev) => prev.filter((item) => (item.id || item._id) !== courseId));
  };

  const clearBasket = () => {
    setItems([]);
  };

  const submitBasket = async () => {
    try {
      if (items.length === 0) return { success: false, error: 'Giỏ hàng trống' };

      let currentEnrolments = [];
      try {
        const saved = localStorage.getItem(ENROLMENTS_STORAGE_KEY);
        currentEnrolments = saved ? JSON.parse(saved) : [];
      } catch {
        currentEnrolments = enrolments;
      }

      const updated = [...currentEnrolments];
      items.forEach((item) => {
        const id = item.id || item._id;
        if (!updated.some((e) => (e.id || e._id) === id)) {
          updated.push({ ...item, enrolledAt: new Date().toISOString() });
        }
      });

      localStorage.setItem(ENROLMENTS_STORAGE_KEY, JSON.stringify(updated));
      localStorage.removeItem(BASKET_STORAGE_KEY);

      setEnrolments(updated);
      setItems([]);

      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return (
    <BasketContext.Provider
      value={{
        items,
        itemCount: items.length,
        enrolments,
        addToBasket,
        removeFromBasket,
        clearBasket,
        submitBasket,
      }}
    >
      {children}
    </BasketContext.Provider>
  );
}

export const useBasket = () => useContext(BasketContext);

// ==========================================
// 2. PAGES
// ==========================================
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

const LoginPageWrapper = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const handleSuccess = () => {
    const loggedUser = { name: 'Admin User', role: 'ADMIN' };
    const fakeToken = 'mock_jwt_token_123';

    login(loggedUser, fakeToken);
    const from = location.state?.from?.pathname || '/admin/courses';
    navigate(from, { replace: true });
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <LoginForm onLoginSuccess={handleSuccess} />
    </div>
  );
};

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

// ==========================================
// 3. MAIN ROUTER
// ==========================================
export default function App() {
  const { user, status, logout } = useAuth();
  const isLoading = status === 'loading';

  return (
    <BasketProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout user={user} onLogout={logout} />}>
            
            {/* Trang chủ */}
            <Route index element={<LandingPage />} />

            {/* Danh mục tất cả khóa học */}
            <Route path="courses" element={<CataloguePage />} />

            {/* Chi tiết từng khóa học - Sử dụng Nested Routes chính xác */}
            <Route path="courses/:courseId" element={<CourseDetailPage />}>
              <Route index element={<CourseOverviewTab />} />
              <Route path="syllabus" element={<CourseSyllabusTab />} />
            </Route>

            {/* Giỏ hàng & Khóa học đã đăng ký */}
            <Route path="basket" element={<BasketPage />} />
            <Route path="my-enrolments" element={<MyEnrolmentsPage />} />

            {/* Đăng nhập */}
            <Route 
              path="login" 
              element={
                <GuestRoute user={user} isLoading={isLoading}>
                  <LoginPageWrapper />
                </GuestRoute>
              } 
            />

            {/* Admin Routes */}
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
    </BasketProvider>
  );
}