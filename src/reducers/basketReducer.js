export const BASKET_ACTION_TYPES = {
  ITEM_ADDED: 'ITEM_ADDED',
  ITEM_REMOVED: 'ITEM_REMOVED',
  BASKET_CLEARED: 'BASKET_CLEARED',
  BASKET_RESTORED: 'BASKET_RESTORED',
};

export const initialBasketState = {
  items: [],
};

export function basketReducer(state, action) {
  switch (action.type) {
    case BASKET_ACTION_TYPES.ITEM_ADDED: {
      const course = action.payload;
      const courseId = course.id || course._id;

      if (!courseId) return state;

      // 1. Không cho phép trùng khóa học
      const exists = state.items.some((item) => (item.id || item._id) === courseId);
      if (exists) return state;

      // 2. Không cho phép thêm khóa học đã hết chỗ
      if (course.isFull === true || (course.availableSeats !== undefined && course.availableSeats <= 0)) {
        return state;
      }

      return {
        ...state,
        items: [...state.items, course],
      };
    }

    case BASKET_ACTION_TYPES.ITEM_REMOVED:
      return {
        ...state,
        items: state.items.filter((item) => (item.id || item._id) !== action.payload.id),
      };

    case BASKET_ACTION_TYPES.BASKET_CLEARED:
      return {
        ...state,
        items: [],
      };

    case BASKET_ACTION_TYPES.BASKET_RESTORED:
      return {
        ...state,
        items: action.payload || [],
      };

    default:
      return state;
  }
}