export function CourseFilter({ level, onFilterChange }) {
  return (
    <select value={level} onChange={(e) => onFilterChange(e.target.value)}>
      <option value="">-- Tất cả cấp độ --</option>
      <option value="BEGINNER">Cơ bản (BEGINNER)</option>
      <option value="INTERMEDIATE">Trung cấp (INTERMEDIATE)</option>
      <option value="ADVANCED">Nâng cao (ADVANCED)</option>
    </select>
  );
}