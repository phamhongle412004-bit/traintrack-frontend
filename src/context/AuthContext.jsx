import React, { createContext, useContext, useEffect, useReducer, useRef } from 'react';
import { authReducer, initialAuthState, AUTH_ACTION_TYPES } from '../reducers/authReducer';

const AUTH_STORAGE_KEY = 'traintrack_v1_auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  // Giữ cờ (flag) để đảm bảo quá trình xác thực tự động (GET /api/auth/me) chỉ thực hiện 1 lần duy nhất khi Mount.
  const isMountedRef = useRef(false);

  useEffect(() => {
    if (isMountedRef.current) return;
    isMountedRef.current = true;

    const checkStoredToken = async () => {
      dispatch({ type: AUTH_ACTION_TYPES.AUTH_CHECK_STARTED });

      try {
        const rawData = localStorage.getItem(AUTH_STORAGE_KEY);
        if (!rawData) {
          dispatch({ type: AUTH_ACTION_TYPES.AUTH_CHECK_FAILED });
          return;
        }

        const { token } = JSON.parse(rawData);
        if (!token) {
          dispatch({ type: AUTH_ACTION_TYPES.AUTH_CHECK_FAILED });
          return;
        }

        // Gọi API xác thực lại token cũ
        const response = await fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const user = await response.json();
          dispatch({
            type: AUTH_ACTION_TYPES.AUTH_CHECK_SUCCEEDED,
            payload: { user, token },
          });
        } else {
          // Token hết hạn hoặc không hợp lệ -> xóa local storage
          localStorage.removeItem(AUTH_STORAGE_KEY);
          dispatch({
            type: AUTH_ACTION_TYPES.AUTH_CHECK_FAILED,
            payload: { error: 'Phiên đăng nhập đã hết hạn' },
          });
        }
      } catch (err) {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        dispatch({
          type: AUTH_ACTION_TYPES.AUTH_CHECK_FAILED,
          payload: { error: 'Không thể kết nối đến máy chủ' },
        });
      }
    };

    checkStoredToken();
  }, []);

  const login = (user, token) => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user, token }));
    dispatch({
      type: AUTH_ACTION_TYPES.USER_LOGGED_IN,
      payload: { user, token },
    });
  };

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    dispatch({ type: AUTH_ACTION_TYPES.USER_LOGGED_OUT });
  };

  return (
    <AuthContext value={{ ...state, login, logout }}>
      {children}
    </AuthContext>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được sử dụng bên trong AuthProvider');
  }
  return context;
}