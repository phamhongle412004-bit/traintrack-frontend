import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom';

import { MainLayout } from './layouts/MainLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';
import { GuestRoute } from './components/GuestRoute';

import CataloguePage from './pages/CataloguePage';
import { CourseDetailPage, CourseOverviewTab, CourseSyllabusTab } from './pages/CourseDetailPage';

// ==========================================
// 1. COMPONENT LOGIN FORM (TASK 4)
// ==========================================
const LoginForm = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  const validate = (data) => {
    const errs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email) errs.email = 'Vui lòng nhập Email.';
    else if (!emailRegex.test(data.email)) errs.email = 'Email không đúng định dạng.';
    if (!data.password) errs.password = 'Vui lòng nhập mật khẩu.';
    else if (data.password.length < 8) errs.password = 'Mật khẩu phải từ 8 ký tự trở lên.';
    return errs;
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validate(formData));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);
    if (touched[name]) setErrors(validate(updated));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    const validationErrors = validate(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    setApiError('');

    try {
      if (onLoginSuccess) onLoginSuccess();
    } catch (err) {
      setApiError('Email hoặc mật khẩu không chính xác.');
      setFormData((prev) => ({ ...prev, password: '' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Đăng nhập</h2>
      {apiError && <div role="alert" className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded">{apiError}</div>}
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
        <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} onBlur={() => handleBlur('email')} aria-invalid={touched.email && !!errors.email} className="w-full p-2 border rounded" />
        {touched.email && errors.email && <p role="alert" className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>
      <div className="mb-4">
        <label htmlFor="password" className="block text-sm font-medium mb-1">Mật khẩu</label>
        <input id="password" name="password" type="password" value={formData.password} onChange={handleChange} onBlur={() => handleBlur('password')} aria-invalid={touched.password && !!errors.password} className="w-full p-2 border rounded" />
        {touched.password && errors.password && <p role="alert" className="text-red-500 text-sm mt-1">{errors.password}</p>}
      </div>
      <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white py-2 rounded disabled:bg-gray-400">
        {isSubmitting ? 'Đang gửi...' : 'Đăng nhập'}
      </button>
    </form>
  );
};

// ==========================================
// 2. COMPONENT COURSE FORM (TASK 4)
// ==========================================
const CourseForm = ({ initialData = null, instructors = [], onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    level: initialData?.level || 'BEGINNER',
    duration: initialData?.duration || '',
    price: initialData?.price || '',
    instructorId: initialData?.instructorId || '',
    seats: initialData?.seats || '',
    summary: initialData?.summary || '',
  });

  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const enrolledSeats = initialData?.enrolledSeats || 0;

  const validate = (data) => {
    const errs = {};
    if (!data.title || data.title.length < 5 || data.title.length > 120) errs.title = 'Tiêu đề phải từ 5 đến 120 ký tự.';
    if (!['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].includes(data.level)) errs.level = 'Trình độ không hợp lệ.';
    const durationNum = Number(data.duration);
    if (!data.duration || durationNum < 1 || durationNum > 500) errs.duration = 'Thời lượng phải từ 1 đến 500 giờ.';
    const priceRegex = /^\d+(\.\d{1,2})?$/;
    if (data.price === '' || Number(data.price) < 0 || !priceRegex.test(String(data.price))) errs.price = 'Giá tiền phải >= 0 (tối đa 2 số thập phân).';
    if (!data.instructorId) errs.instructorId = 'Vui lòng chọn giảng viên.';
    const seatsNum = Number(data.seats);
    if (!Number.isInteger(seatsNum) || seatsNum < 1) errs.seats = 'Số chỗ phải là số nguyên >= 1.';
    else if (seatsNum < enrolledSeats) errs.seats = `Số chỗ không được nhỏ hơn số chỗ đã đăng ký (${enrolledSeats}).`;
    if (data.summary && data.summary.length > 500) errs.summary = 'Tóm tắt không quá 500 ký tự.';
    return errs;
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validate(formData));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);
    if (touched[name]) setErrors(validate(updated));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allTouched = Object.keys(formData).reduce((acc, k) => ({ ...acc, [k]: true }), {});
    setTouched(allTouched);
    const validationErrors = validate(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      if (onSubmitSuccess) onSubmitSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-2xl mx-auto p-6 bg-white rounded shadow space-y-4">
      <h2 className="text-xl font-bold">{initialData ? 'Sửa Khóa Học' : 'Thêm Khóa Học Mới'}</h2>
      <div>
        <label htmlFor="title" className="block font-medium">Tên khóa học</label>
        <input id="title" name="title" value={formData.title} onChange={handleChange} onBlur={() => handleBlur('title')} aria-invalid={touched.title && !!errors.title} className="w-full p-2 border rounded" />
        {touched.title && errors.title && <p role="alert" className="text-red-500 text-sm">{errors.title}</p>}
      </div>
      <div>
        <label htmlFor="level" className="block font-medium">Trình độ</label>
        <select id="level" name="level" value={formData.level} onChange={handleChange} onBlur={() => handleBlur('level')} aria-invalid={touched.level && !!errors.level} className="w-full p-2 border rounded">
          <option value="BEGINNER">BEGINNER</option>
          <option value="INTERMEDIATE">INTERMEDIATE</option>
          <option value="ADVANCED">ADVANCED</option>
        </select>
        {touched.level && errors.level && <p role="alert" className="text-red-500 text-sm">{errors.level}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="duration" className="block font-medium">Thời lượng (Giờ)</label>
          <input id="duration" name="duration" type="number" value={formData.duration} onChange={handleChange} onBlur={() => handleBlur('duration')} aria-invalid={touched.duration && !!errors.duration} className="w-full p-2 border rounded" />
          {touched.duration && errors.duration && <p role="alert" className="text-red-500 text-sm">{errors.duration}</p>}
        </div>
        <div>
          <label htmlFor="price" className="block font-medium">Giá tiền ($)</label>
          <input id="price" name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} onBlur={() => handleBlur('price')} aria-invalid={touched.price && !!errors.price} className="w-full p-2 border rounded" />
          {touched.price && errors.price && <p role="alert" className="text-red-500 text-sm">{errors.price}</p>}
        </div>
      </div>
      <div>
        <label htmlFor="instructorId" className="block font-medium">Giảng viên</label>
        <select id="instructorId" name="instructorId" value={formData.instructorId} onChange={handleChange} onBlur={() => handleBlur('instructorId')} aria-invalid={touched.instructorId && !!errors.instructorId} className="w-full p-2 border rounded">
          <option value="">-- Chọn Giảng Viên --</option>
          {instructors.map((ins) => <option key={ins.id} value={ins.id}>{ins.name}</option>)}
        </select>
        {touched.instructorId && errors.instructorId && <p role="alert" className="text-red-500 text-sm">{errors.instructorId}</p>}
      </div>
      <div>
        <label htmlFor="seats" className="block font-medium">Số chỗ ngồi</label>
        <input id="seats" name="seats" type="number" value={formData.seats} onChange={handleChange} onBlur={() => handleBlur('seats')} aria-invalid={touched.seats && !!errors.seats} className="w-full p-2 border rounded" />
        {touched.seats && errors.seats && <p role="alert" className="text-red-500 text-sm">{errors.seats}</p>}
      </div>
      <div>
        <label htmlFor="summary" className="block font-medium">Tóm tắt mô tả</label>
        <textarea id="summary" name="summary" rows="3" value={formData.summary} onChange={handleChange} onBlur={() => handleBlur('summary')} aria-invalid={touched.summary && !!errors.summary} className="w-full p-2 border rounded" />
        {touched.summary && errors.summary && <p role="alert" className="text-red-500 text-sm">{errors.summary}</p>}
      </div>
      <button type="submit" disabled={isSubmitting} className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:bg-gray-400 font-medium">
        {isSubmitting ? 'Đang lưu...' : (initialData ? 'Cập Nhật Khóa Học' : 'Thêm Khóa Học')}
      </button>
    </form>
  );
};

// ==========================================
// 3. CÁC TRANG VÀ APP CHÍNH
// ==========================================
const LandingPage = () => <div className="p-6">Trang chủ (Landing Page)</div>;
const BasketPage = () => <div className="p-6">Giỏ đăng ký khóa học</div>;
const MyEnrolmentsPage = () => <div className="p-6">Danh sách các khóa học đã đăng ký thành công</div>;
const AdminCoursesPage = () => <div className="p-6">[Admin] Quản lý danh sách khóa học</div>;
const NotFoundPage = () => <div style={{ textAlign: 'center', padding: '60px' }}><h2>404 - Trang không tồn tại</h2></div>;

const LoginPageWrapper = ({ onLogin }) => {
  const navigate = useNavigate();
  const handleSuccess = () => {
    onLogin({ name: 'Admin User', role: 'ADMIN' });
    navigate('/admin/courses/new');
  };
  return <div className="p-8 bg-gray-50 min-h-screen"><LoginForm onLoginSuccess={handleSuccess} /></div>;
};

const AdminCourseNewPage = () => {
  const [instructors, setInstructors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3001/api/instructors')
      .then((res) => res.json())
      .then((data) => setInstructors(data))
      .catch((err) => console.error('Lỗi API:', err));
  }, []);

  return <div className="p-8 bg-gray-50 min-h-screen"><CourseForm instructors={instructors} onSubmitSuccess={() => navigate('/admin/courses')} /></div>;
};

const AdminCourseEditPage = () => {
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
    .catch((err) => console.error('Lỗi API:', err))
    .finally(() => setLoading(false));
  }, [courseId]);

  if (loading) return <div className="p-6 text-center">Đang tải dữ liệu khóa học...</div>;

  return <div className="p-8 bg-gray-50 min-h-screen"><CourseForm initialData={course} instructors={instructors} onSubmitSuccess={() => navigate('/admin/courses')} /></div>;
};

export default function App() {
  const [user, setUser] = useState(null);
  const [isLoading] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout user={user} onLogout={() => setUser(null)} />}>
          <Route index element={<LandingPage />} />
          <Route path="courses" element={<CataloguePage />} />
          <Route path="courses/:courseId" element={<CourseDetailPage />}>
            <Route index element={<CourseOverviewTab />} />
            <Route path="syllabus" element={<CourseSyllabusTab />} />
          </Route>
          <Route path="basket" element={<BasketPage />} />
          <Route path="login" element={<GuestRoute user={user} isLoading={isLoading}><LoginPageWrapper onLogin={(u) => setUser(u)} /></GuestRoute>} />
          <Route path="my-enrolments" element={<ProtectedRoute user={user} isLoading={isLoading}><MyEnrolmentsPage /></ProtectedRoute>} />
          <Route path="admin/courses" element={<AdminRoute user={user} isLoading={isLoading}><AdminCoursesPage /></AdminRoute>} />
          <Route path="admin/courses/new" element={<AdminRoute user={user} isLoading={isLoading}><AdminCourseNewPage /></AdminRoute>} />
          <Route path="admin/courses/:courseId/edit" element={<AdminRoute user={user} isLoading={isLoading}><AdminCourseEditPage /></AdminRoute>} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}