import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CataloguePage } from './pages/CataloguePage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Tự động chuyển hướng từ trang chủ về trang danh mục khóa học */}
        <Route path="/" element={<Navigate to="/courses" replace />} />
        
        {/* Route chính hiển thị Danh mục khóa học (Task 1) */}
        <Route path="/courses" element={<CataloguePage />} />
      </Routes>
    </BrowserRouter>
  );
}