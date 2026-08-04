import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getCourses, getInstructors } from '../api/courses';
import { CourseCard } from '../components/CourseCard';
import { CourseFilter } from '../components/CourseFilter';
import { CourseSearch } from '../components/CourseSearch';
import { CourseSort } from '../components/CourseSort';
import { AsyncDataWrapper } from '../components/AsyncDataWrapper';
import { useBasket } from '../context/BasketContext';

export default function CataloguePage() {
  // 1. Quản lý Query Params trên URL
  const [searchParams, setSearchParams] = useSearchParams();

  // Đọc giá trị ban đầu từ Query String (URL)
  const urlQuery = searchParams.get('q') || '';
  const urlLevel = searchParams.get('level') || '';
  const urlSort = searchParams.get('sort') || '';
  const urlOrder = searchParams.get('order') || '';

  // State local riêng cho input tìm kiếm để UI gõ mượt mà
  const [searchTerm, setSearchTerm] = useState(urlQuery);

  // States lưu giá trị lọc chính thức để trigger gọi API
  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const [level, setLevel] = useState(urlLevel);
  const [sort, setSort] = useState(urlSort);
  const [order, setOrder] = useState(urlOrder);

  // State dữ liệu
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { addToBasket, items } = useBasket();

  // ---------------------------------------------------------
  // 2. DEBOUNCE CHO Ô TÌM KIẾM (Hoãn 400ms mới ghi nhận searchQuery)
  // ---------------------------------------------------------
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchTerm);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Đồng bộ lại searchTerm nếu URL thay đổi (Ví dụ: bấm nút Back / Forward trình duyệt)
  useEffect(() => {
    setSearchTerm(urlQuery);
    setSearchQuery(urlQuery);
    setLevel(urlLevel);
    setSort(urlSort);
    setOrder(urlOrder);
  }, [urlQuery, urlLevel, urlSort, urlOrder]);

  // ---------------------------------------------------------
  // 3. ĐỒNG BỘ TRẠNG THÁI FILTER/SEARCH/SORT LÊN URL QUERY STRING
  // ---------------------------------------------------------
  useEffect(() => {
    const params = new URLSearchParams();

    if (searchQuery) params.set('q', searchQuery);
    if (level) params.set('level', level);
    if (sort) params.set('sort', sort);
    if (order) params.set('order', order);

    // Chỉ cập nhật nếu URL hiện tại khác với params mới
    if (params.toString() !== searchParams.toString()) {
      setSearchParams(params, { replace: true });
    }
  }, [searchQuery, level, sort, order, searchParams, setSearchParams]);

  // ---------------------------------------------------------
  // 4. FETCH GIẢNG VIÊN (CHỈ CHẠY 1 LẦN)
  // ---------------------------------------------------------
  useEffect(() => {
    const controller = new AbortController();

    getInstructors(controller.signal)
      .then((data) => {
        if (Array.isArray(data)) {
          const map = new Map(data.map((i) => [i.id, i.fullName]));
          setInstructors(map);
        }
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        console.error('Lỗi tải giảng viên:', err);
      });

    return () => controller.abort();
  }, []);

  // ---------------------------------------------------------
  // 5. FETCH KHÓA HỌC KHI FILTER/SEARCH/SORT THAY ĐỔI
  // ---------------------------------------------------------
  const fetchCatalogue = useCallback((signal) => {
    setLoading(true);
    setError(null);

    getCourses(
      {
        q: searchQuery,
        level: level,
        sort: sort,
        order: order,
      },
      signal
    )
      .then((data) => {
        setCourses(data || []);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setError(err.message || 'Không thể tải danh sách khóa học');
        setLoading(false);
      });
  }, [searchQuery, level, sort, order]);

  useEffect(() => {
    const controller = new AbortController();
    fetchCatalogue(controller.signal);

    return () => controller.abort();
  }, [fetchCatalogue]);

  // ---------------------------------------------------------
  // 6. XỬ LÝ NÚT THÊM VÀO GIỎ
  // ---------------------------------------------------------
  const handleAddToBasket = (course) => {
    const courseId = course.id || course._id;

    const isAlreadyInBasket = Array.isArray(items) && items.some((item) => (item.id || item._id) === courseId);
    if (isAlreadyInBasket) {
      alert('Khóa học này đã có trong giỏ hàng!');
      return;
    }

    if (course.isFull === true || (course.availableSeats !== undefined && course.availableSeats <= 0)) {
      alert('Khóa học này đã hết chỗ!');
      return;
    }

    addToBasket({ ...course, id: courseId });
    alert('Đã thêm khóa học vào giỏ!');
  };

  return (
    <div className="catalogue-container" style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>Danh Mục Khóa Học</h2>

      {/* Thanh công cụ Tìm kiếm & Bộ lọc */}
      <div className="toolbar" style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <CourseSearch 
          initialValue={searchTerm} 
          onSearch={(term) => setSearchTerm(term)} 
        />
        <CourseFilter 
          level={level} 
          onFilterChange={(newLevel) => setLevel(newLevel)} 
        />
        <CourseSort 
          sort={sort} 
          order={order} 
          onSortChange={(newSort, newOrder) => {
            setSort(newSort);
            setOrder(newOrder);
          }} 
        />
      </div>

      {/* Wrapper quản lý trạng thái Async */}
      <AsyncDataWrapper
        loading={loading}
        error={error}
        isEmpty={courses.length === 0}
        emptyMessage="Không tìm thấy khóa học nào phù hợp."
        onRetry={() => fetchCatalogue()}
      >
        <div 
          className="course-grid" 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
            gap: '20px' 
          }}
        >
          {courses.map((course) => (
            <CourseCard
              key={course.id || course._id}
              course={course}
              instructorName={instructors.get(course.instructorId) || 'Đang cập nhật'}
              onAddToBasket={handleAddToBasket}
            />
          ))}
        </div>
      </AsyncDataWrapper>
    </div>
  );
}