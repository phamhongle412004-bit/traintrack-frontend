export const AUTH_ACTION_TYPES = {
  AUTH_CHECK_STARTED: 'AUTH_CHECK_STARTED',
  AUTH_CHECK_SUCCEEDED: 'AUTH_CHECK_SUCCEEDED',
  AUTH_CHECK_FAILED: 'AUTH_CHECK_FAILED',
  USER_LOGGED_IN: 'USER_LOGGED_IN',
  USER_LOGGED_OUT: 'USER_LOGGED_OUT',
};

export const initialAuthState = {
  user: null,
  token: null,
  status: 'idle', // 'idle' | 'loading' | 'authenticated' | 'unauthenticated'
  error: null,
};

export function authReducer(state, action) {
  switch (action.type) {
    case AUTH_ACTION_TYPES.AUTH_CHECK_STARTED:
      return {
        ...state,
        status: 'loading',
        error: null,
      };

    case AUTH_ACTION_TYPES.AUTH_CHECK_SUCCEEDED:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        status: 'authenticated',
        error: null,
      };

    case AUTH_ACTION_TYPES.AUTH_CHECK_FAILED:
      return {
        ...state,
        user: null,
        token: null,
        status: 'unauthenticated',
        error: action.payload?.error || null,
      };

    case AUTH_ACTION_TYPES.USER_LOGGED_IN:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        status: 'authenticated',
        error: null,
      };

    case AUTH_ACTION_TYPES.USER_LOGGED_OUT:
      return {
        ...state,
        user: null,
        token: null,
        status: 'unauthenticated',
        error: null,
      };

    default:
      return state;
  }
}