export function SeatStatus({ seatsTotal, seatsTaken }) {
  // 🟢 Sửa: seatsTotal và seatsTaken
  const remaining = seatsTotal - seatsTaken;
  const isSoldOut = remaining <= 0;

  return (
    <span style={{ color: isSoldOut ? 'red' : 'green', fontWeight: 'bold' }}>
      {isSoldOut ? 'HẾT CHỖ (Sold Out)' : `Còn ${remaining}/${seatsTotal} chỗ`}
    </span>
  );
}