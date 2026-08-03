import { useState, useEffect } from 'react';
import { getCourses, getInstructors } from '../api/courses';
import { CourseCard } from '../components/CourseCard';
import { CourseFilter } from '../components/CourseFilter';
import { CourseSearch } from '../components/CourseSearch';
import { CourseSort } from '../components/CourseSort';

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

  // 1. Tải danh sách Giảng viên (Chạy 1 lần duy nhất để map ID -> fullName)
  useEffect(() => {
    getInstructors()
      .then((data) => {
        const map = new Map(data.map((i) => [i.id, i.fullName]));
        setInstructors(map);
      })
      .catch((err) => console.error('Lỗi tải giảng viên:', err));
  }, []);

  // 2. Tải danh sách Khóa học mỗi khi Bộ lọc / Tìm kiếm / Sắp xếp thay đổi
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    getCourses({
      q: searchQuery,
      level: level,
      sort: sort,
      order: order,
    })
      .then((data) => {
        if (isMounted) {
          setCourses(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [searchQuery, level, sort, order]);

  // Xử lý khi bấm "Thêm vào giỏ"
  const handleAddToBasket = (course) => {
    console.log('Thêm vào giỏ:', course);
    // Task 3/4 sẽ kết nối Context/Local Storage ở đây
  };

  return (
    <div className="catalogue-container">
      <h2>Danh Mục Khóa Học</h2>

      {/* Thanh công cụ Tìm kiếm & Bộ lọc */}
      <div className="toolbar" style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
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

      {/* Hiển thị Trạng thái UI */}
      {loading && <div className="state-loading">⏳ Đang tải khóa học...</div>}

      {error && <div className="state-error">⚠️ Lỗi: {error}</div>}

      {!loading && !error && courses.length === 0 && (
        <div className="state-empty">🔍 Không tìm thấy khóa học nào phù hợp.</div>
      )}

      {/* Danh sách Khóa học */}
      {!loading && !error && courses.length > 0 && (
        <div className="course-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              instructorName={instructors.get(course.instructorId)}
              onAddToBasket={handleAddToBasket}
            />
          ))}
        </div>
      )}
    </div>
  );
}