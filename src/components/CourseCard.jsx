import { Badge } from './Badge';
import { SeatStatus } from './SeatStatus';

export function CourseCard({ course, instructorName, onAddToBasket }) {
  const remainingSeats = course.totalSeats - course.enrolledCount;
  const isSoldOut = remainingSeats <= 0;

  return (
    <div className={`course-card ${isSoldOut ? 'sold-out' : ''}`}>
      <h3>{course.title}</h3>
      <p>Giảng viên: <strong>{instructorName}</strong></p>
      <p>Cấp độ: <Badge text={course.level} /></p>
      <p>Thời lượng: {course.duration} giờ</p>
      <p>Giá: <strong>${course.price}</strong></p>
      <p><SeatStatus totalSeats={course.totalSeats} enrolledCount={course.enrolledCount} /></p>

      <button disabled={isSoldOut} onClick={() => onAddToBasket(course)}>
        {isSoldOut ? 'Đã hết chỗ' : 'Thêm vào giỏ'}
      </button>
    </div>
  );
}