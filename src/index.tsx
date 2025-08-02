import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { api } from 'apis';
import { queryClient } from 'apis/queryClient';
import { toast, Toaster } from 'sonner';
import store from 'store';
import { fetchUserData, logout, refreshToken } from 'store/auth';

import App from './App';
import { initGA } from './ga';

import './global.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

interface NetworkError {
  code: string;
  config: Record<string, unknown>;
}

interface AuthError {
  response?: {
    status: number;
    data?: {
      code?: string;
    };
  };
  code?: string;
}

const NETWORK_CONFIG = {
  MAX_RETRIES: 4,
  BASE_DELAY: 1000,
  TOAST_DURATION: 3000,
} as const;

const PUBLIC_PATHS = ['login', 'change-password', 'register', 'public'] as const;

let isFirstAuthAttempt = true;
let networkRetryCount = 0;

const resetNetworkRetryCount = (): void => {
  networkRetryCount = 0;
};

const handleNetworkError = async (error: NetworkError): Promise<unknown> => {
  networkRetryCount++;

  if (networkRetryCount < NETWORK_CONFIG.MAX_RETRIES) {
    const delay = NETWORK_CONFIG.BASE_DELAY * networkRetryCount;

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        api.request(error.config).then(resolve).catch(reject);
      }, delay);
    });
  }

  toast.error('Conexão perdida. Você será redirecionado para o login.', {
    duration: 5000,
  });

  store.dispatch(logout());
  resetNetworkRetryCount();

  return Promise.reject(error);
};

const handleAuthError = async (error: AuthError): Promise<void> => {
  const response = error.response;

  const logoutUser = (): void => {
    store.dispatch(logout());
  };

  if (response?.status === 403 && response.data?.code === 'not_permission') {
    toast.error('Você não possui permissão para acessar este recurso', {
      duration: 5000,
    });
    logoutUser();
    return;
  }

  if (isFirstAuthAttempt && response?.status === 403) {
    isFirstAuthAttempt = false;
    delete api.defaults.headers.common.Authorization;

    const isOnPublicPath = PUBLIC_PATHS.some((path) => window.location.pathname.includes(path));

    if (isOnPublicPath || !store.getState().auth.access_token) {
      return;
    }

    try {
      await store.dispatch(refreshToken()).unwrap();

      const accessToken = store.getState().auth.access_token;
      if (accessToken) {
        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        store.dispatch(fetchUserData());
      }
    } catch {
      logoutUser();
    }
  }
};

api.interceptors.response.use(
  (response) => {
    resetNetworkRetryCount();
    isFirstAuthAttempt = true;
    return response;
  },
  async (error) => {
    if (error?.code === 'ERR_NETWORK') {
      return handleNetworkError(error as NetworkError);
    }

    await handleAuthError(error as AuthError);

    return Promise.reject(error);
  },
);

const waitForUserData = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const TIMEOUT = 10000;

    const checkUserData = async (): Promise<void> => {
      while (!store.getState().auth.userData) {
        if (Date.now() - startTime > TIMEOUT) {
          reject(new Error('Timeout: User data not loaded within 10 seconds'));
          return;
        }
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
      resolve();
    };

    checkUserData();
  });
};

api.interceptors.request.use(
  async (config) => {
    if (config.url) {
      config.url = config.url.replace(/\/+$/, '');
    }

    if (config.url?.includes('/auth')) {
      return config;
    }

    const { access_token, userData } = store.getState().auth;

    if (access_token && !userData) {
      await waitForUserData();
    }

    return config;
  },
  (error) => Promise.reject(error),
);

const domNode = document.getElementById('root');
if (domNode !== null) {
  const root = createRoot(domNode);

  root.render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Suspense>
          <Toaster
            richColors
            duration={2000}
            position='top-center'
            expand={false}
            toastOptions={{
              style: {
                fontSize: '18px',
                minWidth: 'max-content',
              },
            }}
          />
          <App />
        </Suspense>
      </QueryClientProvider>
    </Provider>,
  );
}

initGA();
