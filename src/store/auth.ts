import { useSelector } from 'react-redux';
import { createAction, createAsyncThunk, createReducer } from '@reduxjs/toolkit';
import { api } from 'apis';
import { RootState } from 'store';

export type AuthState = {
  userId?: number;
  status: 'unauthenticated' | 'authenticated';
  userData?: UserData;
};

export type UserData = {
  id: number;
  name: string;
};

type AnonymousLogin = {
  userId: number;
};

export const logout = createAction('LOGOUT');

export const login = createAction<AnonymousLogin>('LOGIN');

export const fetchUserData = createAsyncThunk('FETCH_USER_DATA', async () => {
  return {
    id: 1, // Placeholder for user ID
    name: 'John Doe', // Placeholder for user name
  } as UserData; // Simulated user data, replace with actual API call if needed
});

const buildInitialState = (): AuthState => ({
  status: 'unauthenticated',
});

const initialState = buildInitialState();

try {
  const anonymousUserId = localStorage.getItem('@sea/anonymousUser');

  if (typeof anonymousUserId === 'string') {
    initialState.userId = Number(anonymousUserId);
    initialState.status = 'authenticated';

    api.defaults.headers.common['User-Id'] = String(initialState.userId);
  }
} catch (_err) {
  // Ignore
}

const selector = (state: RootState) => state.auth;
export const useAuthState = () => useSelector(selector);

export const isAuthenticated = (state: RootState) => state.auth.status === 'authenticated';

const setTokens = (userId?: number): AuthState => {
  if (userId) {
    api.defaults.headers.common['User-Id'] = String(userId);

    localStorage.setItem('@sea/anonymousUser', String(userId));

    try {
      return {
        userId,
        status: 'authenticated',
      };
    } catch (_err) {
      console.log(_err);
    }
  }

  return buildInitialState();
};

const removeTokens = () => {
  localStorage.removeItem('@sea/anonymousUser');
  delete api.defaults.headers.common['User-Id'];
  return buildInitialState();
};

export default createReducer(initialState, (builder) => {
  builder
    .addCase(login, (_, action) => setTokens(action.payload.userId))
    .addCase(fetchUserData.rejected, () => buildInitialState())
    .addCase(fetchUserData.fulfilled, (state: AuthState, action) => {
      return {
        ...state,
        userData: action.payload,
      };
    })
    .addCase(logout, () => removeTokens());
});
