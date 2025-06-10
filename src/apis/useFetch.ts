import { useCallback, useEffect, useState } from 'react';
import _ from 'lodash';

import { useRequest } from '.';

const useFetch = <T>(url?: string, params?: object, initialValue?: T, enable: boolean = true) => {
  const [data, setData] = useState<T | undefined | Error>(initialValue);
  const [attr, setAttr] = useState(params);
  const [loading, setLoading] = useState(true);

  const [enabledState, setEnabledState] = useState(enable);

  useEffect(() => {
    setEnabledState(enable);
  }, [enable]);

  const request = useRequest();

  const fetch = useCallback(async () => {
    if (!enabledState) {
      return;
    }
    if (url) {
      setLoading(true);
      const source = await request<T>({
        url,
        params: attr,
        onSuccess: setData,
        onError: setData,
      });
      setLoading(false);

      return () => source.cancel();
    }
  }, [enabledState, url, request, attr]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  useEffect(() => {
    if (!_.isEqual(attr, params)) {
      setAttr(params);
    }
  }, [attr, params]);

  if (data instanceof Error) {
    return { request, error: data, reload: fetch, loading };
  }

  return { request, data, reload: fetch, loading };
};

export const useFetchWithEnable = <T>(url?: string, enable?: boolean) =>
  useFetch<T>(url, undefined, undefined, enable);

export default useFetch;
