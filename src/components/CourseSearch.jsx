import { useState, useEffect } from 'react';

export function CourseSearch({ initialValue , onSearch }) {
  const [term, setTerm] = useState(initialValue);

  // Cập nhật local state nếu URL thay đổi bên ngoài
  useEffect(() => {
    setTerm(initialValue);
  }, [initialValue]);

  // Debounce 400ms
  useEffect(() => {
    const timer = setTimeout(() => {
      if (term !== initialValue) {
        onSearch(term);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [term, initialValue, onSearch]);

  return (
    <input
      type="text"
      placeholder="Tìm kiếm khóa học..."
      value={term}
      onChange={(e) => setTerm(e.target.value)}
    />
  );
}