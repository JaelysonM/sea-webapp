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

import './global.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

let firstTry = true;

const publicPaths = ['login', 'change-password', 'register', 'confirm-company', 'public'];

api.interceptors.response.use(
  (config) => config,
  (err) => {
    const res = err.response;

    if (err?.code === 'ERR_NETWORK') {
      toast.error('Erro de conexão com o servidor', {
        duration: 5000,
      });
      store.dispatch(logout());
      return;
    }

    const kickUser = () => {
      store.dispatch(logout());
      toast.error('Você não está autorizado a acessar este recurso', {
        duration: 5000,
      });
    };

    if (res?.status === 403 && res.data['code'] === 'not_permission') {
      kickUser();
      return;
    }
    if (firstTry && (res?.status === 403 || err.code === 'ERR_NETWORK')) {
      delete api.defaults.headers.common.Authorization;

      publicPaths.forEach((path) => {
        if (window.location.pathname.includes(path)) {
          firstTry = false;
        }
      });

      store
        .dispatch(refreshToken())
        .then(() => {
          const accessToken = store.getState().auth.access_token;
          if (accessToken) {
            api.defaults.headers.common['Authorization'] = `Bearer ${
              store.getState().auth.access_token
            }`;
            store.dispatch(fetchUserData());
          }
        })
        .catch(kickUser);
    }

    return Promise.reject(err);
  },
);

api.interceptors.request.use(
  (config) => {
    const url = (config.url = config.url?.replace(/\/+$/, ''));

    if (url?.includes('/auth')) {
      return config;
    }

    const { access_token, userData } = store.getState().auth;

    if (access_token && !userData) {
      return new Promise((resolve, reject) => {
        const checkUserData = async () => {
          const startTime = Date.now();
          const timeout = 10000;

          while (!store.getState().auth.userData) {
            if (Date.now() - startTime > timeout) {
              reject(new Error('Timeout: Usuário não foi carregado em 10 segundos'));
              return;
            }
            await new Promise((resolve) => setTimeout(resolve, 50));
          }
          const company = localStorage.getItem('@sicria/company');
          if (company) config.headers['Company-ID'] = company;
          resolve(config);
        };
        checkUserData();
      });
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (config) => config,
  (err) => {
    const res = err.response;

    const kickUser = () => {
      store.dispatch(logout());
    };
    if (res?.status === 403 && res.data['code'] === 'not_permission') {
      kickUser();
      return;
    }
    if (firstTry && (res?.status === 403 || err.code === 'ERR_NETWORK')) {
      delete api.defaults.headers.common.Authorization;

      publicPaths.forEach((path) => {
        if (window.location.pathname.includes(path)) {
          firstTry = false;
        }
      });
      if (!store.getState().auth.access_token) return;

      store
        .dispatch(refreshToken())
        .then(() => {
          api.defaults.headers.common['Authorization'] = `Bearer ${
            store.getState().auth.access_token
          }`;
          store.dispatch(fetchUserData());
        })
        .catch(kickUser);
    }

    return Promise.reject(err);
  },
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
