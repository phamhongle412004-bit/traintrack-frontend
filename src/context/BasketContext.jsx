import React, { createContext, useContext, useState, useEffect } from 'react';

const BasketContext = createContext(null);

const BASKET_STORAGE_KEY = 'traintrack_basket';
const ENROLMENTS_STORAGE_KEY = 'traintrack_my_enrolments';

export function BasketProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(BASKET_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [enrolments, setEnrolments] = useState(() => {
    try {
      const saved = localStorage.getItem(ENROLMENTS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(BASKET_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem(ENROLMENTS_STORAGE_KEY, JSON.stringify(enrolments));
  }, [enrolments]);

  const addToBasket = (course) => {
    if (!course) return;
    setItems((prevItems) => {
      const courseId = course.id || course._id;
      const exists = prevItems.some((item) => (item.id || item._id) === courseId);
      if (exists) return prevItems;
      return [...prevItems, course];
    });
  };

  const removeFromBasket = (courseId) => {
    setItems((prev) => prev.filter((item) => (item.id || item._id) !== courseId));
  };

  const clearBasket = () => {
    setItems([]);
  };

  const submitBasket = async () => {
    try {
      if (items.length === 0) return { success: false, error: 'Giỏ hàng trống' };

      setEnrolments((prevEnrolments) => {
        const updated = [...prevEnrolments];
        items.forEach((item) => {
          const id = item.id || item._id;
          if (!updated.some((e) => (e.id || e._id) === id)) {
            updated.push({ ...item, enrolledAt: new Date().toISOString() });
          }
        });
        return updated;
      });

      setItems([]);
      localStorage.removeItem(BASKET_STORAGE_KEY);

      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return (
    <BasketContext.Provider
      value={{
        items,
        itemCount: items.length,
        enrolments,
        addToBasket,
        removeFromBasket,
        clearBasket,
        submitBasket,
      }}
    >
      {children}
    </BasketContext.Provider>
  );
}

export const useBasket = () => useContext(BasketContext);