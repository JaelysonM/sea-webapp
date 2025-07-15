import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { api } from 'apis';
import { queryClient } from 'apis/queryClient';
import store from 'store';
import { fetchUserData, logout, refreshToken } from 'store/auth';

import App from './App';

import './global.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

let firstTry = true;

const publicPaths = ['login', 'store'];

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
          <App />
        </Suspense>
      </QueryClientProvider>
    </Provider>,
  );
}
