import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { API_DEFAULT_HEADERS, API_SERVER_URL } from 'consts';

// Estender o tipo para incluir _retry
interface RetryAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const api = axios.create({
  baseURL: API_SERVER_URL,
  headers: API_DEFAULT_HEADERS,
});

// Flag para evitar múltiplas tentativas de refresh simultâneas
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token!);
    }
  });

  failedQueue = [];
};

// Interceptor para respostas
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryAxiosRequestConfig;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (isRefreshing) {
        // Se já está fazendo refresh, adiciona à fila
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('@sea/refresh');

      if (!refreshToken) {
        // Não há refresh token, fazer logout
        localStorage.removeItem('@sea/access');
        localStorage.removeItem('@sea/refresh');
        delete api.defaults.headers.common.Authorization;
        window.location.href = '/not-authenticated';
        return Promise.reject(error);
      }

      try {
        const response = await api.post('/auth/refresh', {
          refresh_token: refreshToken,
        });

        const { access_token } = response.data;

        // Atualizar tokens
        localStorage.setItem('@sea/access', access_token);
        api.defaults.headers.common.Authorization = `Bearer ${access_token}`;

        processQueue(null, access_token);

        // Reenviar requisição original
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
        }

        return api(originalRequest);
      } catch (refreshError) {
        // Refresh falhou, fazer logout
        processQueue(refreshError, null);
        localStorage.removeItem('@sea/access');
        localStorage.removeItem('@sea/refresh');
        delete api.defaults.headers.common.Authorization;
        window.location.href = '/not-authenticated';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
