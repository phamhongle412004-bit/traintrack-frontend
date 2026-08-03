export function CourseSort({ sort, order, onSortChange }) {
  const handleChange = (e) => {
    const value = e.target.value;
    if (!value) {
      onSortChange('', '');
      return;
    }
    const [newSort, newOrder] = value.split('-');
    onSortChange(newSort, newOrder);
  };

  const currentValue = sort && order ? `${sort}-${order}` : '';

  return (
    <select value={currentValue} onChange={handleChange}>
      <option value="">-- Mặc định --</option>
      <option value="title-asc">Tiêu đề (A-Z)</option>
      <option value="title-desc">Tiêu đề (Z-A)</option>
      <option value="price-asc">Giá (Thấp đến Cao)</option>
      <option value="price-desc">Giá (Cao đến Thấp)</option>
      <option value="durationHours-asc">Thời lượng (Ngắn đến Dài)</option>
      <option value="durationHours-desc">Thời lượng (Dài đến Ngắn)</option>
    </select>
  );
}