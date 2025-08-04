import { useCallback, useState } from 'react';
import { Scale } from '@types';
import { useRequest } from 'apis';

import type { Pageable } from 'components/hooks/useInfinityList';

const useScales = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scales, setScales] = useState<Scale[]>([]);

  const request = useRequest();

  const fetchScales = useCallback(async (): Promise<Scale[]> => {
    setIsLoading(true);
    setError(null);

    const promise = new Promise<Scale[]>((resolve) => {
      request<Pageable<Scale>>({
        method: 'GET',
        url: '/scales',
        params: { is_attached: false },
        onSuccess: (data) => {
          const scalesData = data.data;
          setScales(scalesData);
          setIsLoading(false);
          resolve(scalesData);
        },
        onError: (err) => {
          const errorMessage =
            (err?.response?.data as { message?: string })?.message || 'Erro ao carregar balanças';
          setError(errorMessage);
          setIsLoading(false);
          resolve([]);
        },
      });
    });

    return promise;
  }, [request]);

  return {
    scales,
    fetchScales,
    isLoading,
    error,
    setError: (error: string | null) => setError(error),
  };
};

export default useScales;
