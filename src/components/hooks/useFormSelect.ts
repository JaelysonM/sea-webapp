import { useCallback } from 'react';

import { useList } from '.';

type useFormSelectReturn<T> = {
  data: T[];
  reload: (direction: 'up' | 'down') => void;
  refetch: () => void;
};

export type Pageable<T> = {
  options: {
    page: number;
    size: number;
    results: number;
    pages: number;
  };
  data: T[];
};

type Props = string;

const useFormSelect = <T>(baseUrl: Props): useFormSelectReturn<T> => {
  const { data, pagination, reload: refetch } = useList({ baseUrl });

  const reload = useCallback(
    (direction: 'up' | 'down') => {
      if (direction === 'down') {
        pagination.updateStep((c) => c + 1);
      }

      if (direction === 'up' && pagination.currentPage > 1) {
        pagination.updateStep((c) => c - 1);
      }
    },
    [pagination],
  );

  return {
    data: data?.data as T[],
    reload,
    refetch,
  };
};

export default useFormSelect;
