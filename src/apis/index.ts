import { AxiosError, AxiosRequestConfig } from 'axios';

export { default as api } from './api';
export { default as useFetch } from './useFetch';
export { useFetchWithEnable } from './useFetch';
export { default as useRequest } from './useRequest';
export { default as viacep } from './viacep';

export type RequestError<T> = AxiosError<T>;

export type RequestConfig<T> = AxiosRequestConfig & {
  onStarted?: () => void;
  onSuccess?: (data: T) => void;
  onError?: (err: RequestError<T>) => void;
  onCancel?: (mounted: boolean) => void;
  onComplete?: () => void;
};

export type { CancelTokenSource } from 'axios';
