export function CourseSort({ sort, order, onSortChange }) {
  const handleChange = (e) => {
    const [newSort, newOrder] = e.target.value.split('-');
    onSortChange(newSort, newOrder);
  };

  return (
    <select value={`${sort}-${order}`} onChange={handleChange}>
      <option value="title-asc">Tiêu đề (A-Z)</option>
      <option value="title-desc">Tiêu đề (Z-A)</option>
      <option value="price-asc">Giá (Thấp đến Cao)</option>
      <option value="price-desc">Giá (Cao đến Thấp)</option>
    </select>
  );
}