import { useCallback, useEffect, useRef } from 'react';
import axios, { AxiosInstance, CancelTokenSource } from 'axios';
import { call } from 'utils';

import { api as mainApi, RequestConfig, RequestError } from '.';

const useRequest = (
  api?: AxiosInstance,
): (<T>(config: RequestConfig<T>) => Promise<CancelTokenSource>) => {
  const sources = useRef<CancelTokenSource[]>([]);

  const request = useCallback(
    <T>(config: RequestConfig<T>) => {
      const instance = api || mainApi;
      const source = axios.CancelToken.source();
      const { onSuccess, onError, onCancel, onComplete, onStarted, ...rest } = config;

      sources.current.push(source);
      onStarted?.();

      return new Promise<CancelTokenSource>((resolve) => {
        instance
          .request<T>({ ...rest, cancelToken: source.token })
          .then(({ data }) => {
            try {
              call(onSuccess, data);
              resolve(source);
            } catch (_err) {
              // Ignore
            }
          })
          .catch((err: RequestError<T>) => {
            if (axios.isCancel(err)) {
              call(onCancel, err.message !== 'unmount');
            } else {
              call(onError, err);
            }
          })
          .finally(() => {
            sources.current.splice(sources.current.indexOf(source), 1);
            call(onComplete);
          });
      });
    },
    [api],
  );

  useEffect(
    () => () => {
      for (const source of sources.current) {
        source.cancel('unmount');
      }
    },
    [],
  );

  return request;
};

export default useRequest;
