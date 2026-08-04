import React, { useState, useEffect, useCallback } from 'react';
import { getCourses, getInstructors } from '../api/courses';
import { CourseCard } from '../components/CourseCard';
import { CourseFilter } from '../components/CourseFilter';
import { CourseSearch } from '../components/CourseSearch';
import { CourseSort } from '../components/CourseSort';
import { AsyncDataWrapper } from '../components/AsyncDataWrapper';

export default function CataloguePage() {
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // States quản lý Bộ lọc / Tìm kiếm / Sắp xếp
  const [searchQuery, setSearchQuery] = useState('');
  const [level, setLevel] = useState('');
  const [sort, setSort] = useState('');
  const [order, setOrder] = useState('');

  // 1. Tải danh sách Giảng viên (Map ID -> fullName)
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

  // 2. Hàm fetch danh sách khóa học có AbortSignal
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
        // Hủy request thừa khi gõ nhanh -> Không update state
        if (err.name === 'AbortError') return;
        setError(err.message || 'Không thể tải danh sách khóa học');
        setLoading(false);
      });
  }, [searchQuery, level, sort, order]);

  // 3. Trigger fetch khi bộ lọc thay đổi
  useEffect(() => {
    const controller = new AbortController();
    fetchCatalogue(controller.signal);

    return () => controller.abort();
  }, [fetchCatalogue]);

  // Xử lý khi bấm "Thêm vào giỏ"
  const handleAddToBasket = (course) => {
    console.log('Thêm vào giỏ:', course);
  };

  return (
    <div className="catalogue-container">
      <h2>📚 Danh Mục Khóa Học</h2>

      {/* Thanh công cụ Tìm kiếm & Bộ lọc */}
      <div className="toolbar" style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <CourseSearch 
          initialValue={searchQuery} 
          onSearch={(term) => setSearchQuery(term)} 
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

      {/* Wrapper quản lý 4 trạng thái: Loading, Error (có nút Retry), Empty, Success */}
      <AsyncDataWrapper
        loading={loading}
        error={error}
        isEmpty={courses.length === 0}
        emptyMessage="🔍 Không tìm thấy khóa học nào phù hợp."
        onRetry={() => fetchCatalogue()}
      >
        <div className="course-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {courses.map((course) => (
            <CourseCard
              key={course.id}
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