import { Badge } from './Badge';
import { SeatStatus } from './SeatStatus';

export function CourseCard({ course, instructorName, onAddToBasket }) {
  const remainingSeats = course.seatsTotal - course.seatsTaken;
  const isSoldOut = remainingSeats <= 0;

  return (
    <div className={`course-card ${isSoldOut ? 'sold-out' : ''}`}>
      <h3>{course.title}</h3>
      <p>Giảng viên: <strong>{instructorName || 'Chưa rõ'}</strong></p>
      <p>Cấp độ: <Badge text={course.level} /></p>
      <p>Thời lượng: {course.durationHours} giờ</p>
      <p>Giá: <strong>${course.price}</strong></p>
      <p><SeatStatus seatsTotal={course.seatsTotal} seatsTaken={course.seatsTaken} /></p>

      <button disabled={isSoldOut} onClick={() => onAddToBasket && onAddToBasket(course)}>
        {isSoldOut ? 'Đã hết chỗ' : 'Thêm vào giỏ'}
      </button>
    </div>
  );
}