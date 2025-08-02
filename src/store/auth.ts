import { useSelector } from 'react-redux';
import { createAction, createAsyncThunk, createReducer, Middleware } from '@reduxjs/toolkit';
import { api } from 'apis';
import { AxiosError } from 'axios';
import jwt from 'jwt-decode';
import { RootState } from 'store';

export type AuthState = {
  user_id?: number;
  access_token?: string;
  refresh_token?: string | null;
  status: 'unauthenticated' | 'authenticated';
  userData?: UserData;
};

type AuthenticationResponse = {
  access_token: string;
  refresh_token: string;
};

type Group = {
  id?: number;
  name: string;
};

export type UserData = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  is_active: boolean;
  is_super_user: boolean;
  created_at: string;
  updated_at: string;
  last_login: string;
  permissions: [];
  groups: Group[];
};

type FastAuth = {
  token: string;
};

type LoginCredentials = {
  email: string;
  password: string;
};

export const logout = createAction('LOGOUT');

export const login = createAsyncThunk('LOGIN', async (data: FastAuth, { rejectWithValue }) => {
  try {
    const request = await api.post<AuthenticationResponse>('qrcode/authenticate', data);
    return request.data;
  } catch (error) {
    return rejectWithValue((error as AxiosError).response?.data);
  }
});

export const loginWithCredentials = createAsyncThunk(
  'LOGIN_WITH_CREDENTIALS',
  async (data: LoginCredentials, { rejectWithValue }) => {
    try {
      const request = await api.post<AuthenticationResponse>('auth/login', data);
      return request.data;
    } catch (error) {
      return rejectWithValue((error as AxiosError).response?.data);
    }
  },
);

export const refreshToken = createAsyncThunk(
  'REFRESH_TOKEN',
  async (): Promise<AuthenticationResponse> => {
    const refresh_token = sessionStorage.getItem('@sea/refresh');
    return (
      await api.post('/auth/refresh', {
        refresh_token,
      })
    ).data;
  },
);

export const fetchUserData = createAsyncThunk('FETCH_USER_DATA', async () => {
  return (await api.get('/auth/me')).data;
});

const buildInitialState = (): AuthState => ({
  status: 'unauthenticated',
});

const initialState = buildInitialState();

try {
  const refresh = sessionStorage.getItem('@sea/refresh');
  const access = sessionStorage.getItem('@sea/access');

  if (typeof access === 'string') {
    const { user_id } = jwt(access) satisfies AuthState;

    initialState.user_id = user_id;
    initialState.access_token = access;
    initialState.refresh_token = refresh;
    initialState.status = 'authenticated';

    api.defaults.headers.common.Authorization = `Bearer ${access}`;
  }
} catch (_err) {
  // Ignore
}

const selector = (state: RootState) => state.auth;
export const useAuthState = () => useSelector(selector);

export const isUserDataLoaded = (state: RootState) => !!state.auth.userData;

export const isAuthenticated = (state: RootState) => state.auth.status === 'authenticated';
export const isAdmin = (state: RootState) => {
  const userData = state.auth.userData;

  if (userData?.is_super_user) return true;
  if (userData?.groups) {
    return userData.groups.some((group) => group.id === 1);
  }
  return false;
};
export const isUser = (state: RootState) => {
  const userData = state.auth.userData;

  if (userData?.is_super_user) return false;

  return true;
};

const actionTypes = [
  logout.type,
  login.fulfilled.type,
  login.rejected.type,
  loginWithCredentials.fulfilled.type,
  loginWithCredentials.rejected.type,
  refreshToken.fulfilled.type,
  refreshToken.rejected.type,
  fetchUserData.fulfilled.type,
  fetchUserData.rejected.type,
];

export const persistor: Middleware = (store) => (next) => (action) => {
  const result = next(action);
  if (actionTypes.includes(result.type)) {
    const { access_token, refresh_token } = store.getState().auth;

    const accessConditions = {
      true: () => {
        sessionStorage.setItem('@sea/access', access_token);
        api.defaults.headers.common.Authorization = `Bearer ${access_token}`;
      },
      false: () => {
        sessionStorage.removeItem('@sea/access');
        delete api.defaults.headers.common.Authorization;
      },
    };

    const refreshConditions = {
      true: () => {
        sessionStorage.setItem('@sea/refresh', refresh_token);
      },
      false: () => {
        sessionStorage.removeItem('@sea/refresh');
      },
    };

    accessConditions[String(!!access_token) as keyof typeof accessConditions]();
    refreshConditions[String(!!refresh_token) as keyof typeof refreshConditions]();
  }

  return result;
};

const setTokens = (state: AuthState, res: AuthenticationResponse): AuthState => {
  const { access_token, refresh_token } = res;
  if (access_token) {
    api.defaults.headers.common.Authorization = `Bearer ${access_token}`;
    try {
      const { user_id } = jwt(access_token) satisfies AuthState;
      return {
        user_id,
        access_token,
        refresh_token: refresh_token || state.refresh_token,
        status: 'authenticated',
      };
    } catch (_err) {
      console.log(_err);
    }
  }

  return buildInitialState();
};

const removeTokens = () => {
  sessionStorage.removeItem('@sea/access');
  sessionStorage.removeItem('@sea/refresh');
  delete api.defaults.headers.common.Authorization;
  return buildInitialState();
};

export default createReducer(initialState, (builder) => {
  builder
    .addCase(login.rejected, (state) => {
      console.log('Login failed, clearing state');
      return {
        ...state,
        status: 'unauthenticated' as const,
        access_token: undefined,
        refresh_token: undefined,
        user_id: undefined,
      };
    })
    .addCase(login.fulfilled, (state: AuthState, action) => setTokens(state, action.payload))
    .addCase(loginWithCredentials.rejected, (state) => {
      return {
        ...state,
        status: 'unauthenticated' as const,
        access_token: undefined,
        refresh_token: undefined,
        user_id: undefined,
      };
    })
    .addCase(loginWithCredentials.fulfilled, (state: AuthState, action) =>
      setTokens(state, action.payload),
    )
    .addCase(fetchUserData.rejected, () => buildInitialState())
    .addCase(fetchUserData.fulfilled, (state: AuthState, action) => {
      return {
        ...state,
        userData: action.payload,
      };
    })
    .addCase(logout, () => removeTokens())
    .addCase(refreshToken.rejected, () => buildInitialState())
    .addCase(refreshToken.fulfilled, (state: AuthState, action) =>
      setTokens(state, action.payload),
    );
});
