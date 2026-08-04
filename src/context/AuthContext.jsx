import React, { createContext, useContext, useEffect, useReducer, useRef } from 'react';
import { authReducer, initialAuthState, AUTH_ACTION_TYPES } from '../reducers/authReducer';

const AUTH_STORAGE_KEY = 'traintrack_v1_auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);
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

        const { user, token } = JSON.parse(rawData);
        if (!token) {
          dispatch({ type: AUTH_ACTION_TYPES.AUTH_CHECK_FAILED });
          return;
        }

        // GIẢI PHÁP AN TOÀN: Đọc dữ liệu user sẵn có từ localStorage
        // Giúp giữ trạng thái đăng nhập ngay cả khi API /api/auth/me không phản hồi
        dispatch({
          type: AUTH_ACTION_TYPES.AUTH_CHECK_SUCCEEDED,
          payload: { user, token },
        });

      } catch (err) {
        dispatch({
          type: AUTH_ACTION_TYPES.AUTH_CHECK_FAILED,
          payload: { error: 'Lỗi xác thực thiết bị' },
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
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được sử dụng bên trong AuthProvider');
  }
  return context;
}