import { useEffect, useState, useRef } from 'react';


export function useHeaderBadgeAnimation(itemCount) {
  const [isBouncing, setIsBouncing] = useState(false);
  
  // useRef lưu ID của timer để clear timeout nếu component unmount, tránh memory leak
  const timerRef = useRef(null);

  useEffect(() => {
    if (itemCount > 0) {
      setIsBouncing(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setIsBouncing(false), 300);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [itemCount]);

  return isBouncing;
}