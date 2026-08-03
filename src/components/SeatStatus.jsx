export function SeatStatus({ totalSeats, enrolledCount }) {
  const remaining = totalSeats - enrolledCount;
  const isSoldOut = remaining <= 0;

  return (
    <span style={{ color: isSoldOut ? 'red' : 'green', fontWeight: 'bold' }}>
      {isSoldOut ? 'HẾT CHỖ (Sold Out)' : `Còn ${remaining} chỗ`}
    </span>
  );
}