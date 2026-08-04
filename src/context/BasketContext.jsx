import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { basketReducer, initialBasketState, BASKET_ACTION_TYPES } from '../reducers/basketReducer';

const BASKET_STORAGE_KEY = 'traintrack_v1_basket';

const BasketContext = createContext(null);

export function BasketProvider({ children }) {
  const [state, dispatch] = useReducer(basketReducer, initialBasketState, (initial) => {
    try {
      const saved = localStorage.getItem(BASKET_STORAGE_KEY);
      return saved ? { items: JSON.parse(saved) } : initial;
    } catch {
      return initial;
    }
  });

  // Tự động lưu vết vào localStorage khi basket items thay đổi
  useEffect(() => {
    localStorage.setItem(BASKET_STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items]);

  const addToBasket = (course) => {
    dispatch({ type: BASKET_ACTION_TYPES.ITEM_ADDED, payload: course });
  };

  const removeFromBasket = (courseId) => {
    dispatch({ type: BASKET_ACTION_TYPES.ITEM_REMOVED, payload: { id: courseId } });
  };

  const clearBasket = () => {
    dispatch({ type: BASKET_ACTION_TYPES.BASKET_CLEARED });
  };

  const submitBasket = async () => {
    try {
      const response = await fetch('/api/enrolments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseIds: state.items.map((i) => i.id) }),
      });

      if (!response.ok) throw new Error('Đăng ký thất bại');

      // Submit giỏ hàng thành công mới làm rỗng giỏ
      clearBasket();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const itemCount = state.items.length;

  return (
    <BasketContext
      value={{
        items: state.items,
        itemCount,
        addToBasket,
        removeFromBasket,
        clearBasket,
        submitBasket,
      }}
    >
      {children}
    </BasketContext>
  );
}

export function useBasket() {
  const context = useContext(BasketContext);
  if (!context) {
    throw new Error('useBasket phải được sử dụng bên trong BasketProvider');
  }
  return context;
}