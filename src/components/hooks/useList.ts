import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { api } from 'apis';

import { useWindowSize } from '.';

export type Pageable<T> = {
  options: {
    page: number;
    pages: number;
    results: number;
    size: number;
  };
  data: T[];
};

type Props = {
  baseUrl: string;
  page_size?: number;
  page?: number;
  query?: string;
  queryEnabled?: boolean;
};

export type UpdatePagination = {
  page?: number;
  stealth?: boolean;
  sum?: boolean;
};

type setStepCallbackType = (step: number | ((step: number) => number)) => void;

const useList = <T>({ baseUrl, query, queryEnabled, page_size }: Props) => {
  const [searchParams, setSearchParms] = useSearchParams();

  const currentPage = useMemo(() => parseInt(searchParams.get('page') || '1'), [searchParams]);
  const showedPages = useMemo(
    () => parseInt(searchParams.get('showedPages') || '0'),
    [searchParams],
  );

  function formattedSearchParams() {
    const params = {} as Record<string, string>;

    for (const [key, value] of searchParams.entries()) {
      if (!key.includes('.order') && !key.includes('page')) {
        params[key] = value;
      }
    }

    return params;
  }

  function formattedSearchOrderParams() {
    const params = {} as Record<string, string>;

    for (const [key, value] of searchParams.entries()) {
      if (key.includes('.order') && !key.includes('page')) {
        const formattedKey = key.split('.order')[0];
        params[formattedKey] = value;
      }
    }

    return params;
  }

  const queryFn = async () => {
    const filterString = Object.entries(formattedSearchParams());
    const formmattedFilters = filterString.map(([key, value]) => `${key}=${value}`).join('&');

    const sortString = Object.entries(formattedSearchOrderParams());
    const formmattedSort = sortString.map(([key, value]) => `order=${key},${value}`).join('&');

    const fetchUrl =
      `${baseUrl}?page_size=${size === 0 ? 10 : size}&page=${currentPage}` +
      (formmattedFilters ? `&${formmattedFilters}` : '') +
      (formmattedSort ? `&${formmattedSort}` : '') +
      (query ? `&${query}` : '');

    const { data } = await api.get(fetchUrl);
    return data;
  };

  const { height } = useWindowSize();

  const isVideo = baseUrl.includes('videos') || baseUrl.includes('schedule');
  const rowSize = isVideo ? 80 : 56;

  const size = page_size ?? useMemo(() => Math.floor((height * 0.7) / rowSize), [height, rowSize]);

  const enabled = size > 0 && queryEnabled;

  const useListQuery = <T>() => {
    return useQuery<T>({
      queryKey: [
        `list${baseUrl}`,
        currentPage,
        formattedSearchParams(),
        formattedSearchOrderParams(),
        query,
        queryEnabled,
      ],
      queryFn,
      placeholderData: keepPreviousData,
      enabled,
      staleTime: Infinity,
    });
  };

  const { data, refetch } = useListQuery<Pageable<T>>();

  const maxStep = useMemo(() => data?.options?.pages || 1, [data?.options]);

  const canGoToNextStep = useMemo(() => currentPage + 1 <= maxStep, [currentPage, maxStep]);

  const canGoToPrevStep = useMemo(() => currentPage - 1 >= 1, [currentPage]);

  const setPage = useCallback<setStepCallbackType>(
    (step) => {
      const newStep = step instanceof Function ? step(currentPage) : step;

      if (newStep >= 1 && newStep <= maxStep) {
        setSearchParms((state) => {
          state.set('page', newStep.toString());
          return state;
        });

        return;
      }

      throw new Error('Step not valid');
    },
    [maxStep, currentPage, setSearchParms],
  );

  const goToNextPage = useCallback(() => {
    if (canGoToNextStep) {
      setSearchParms((state) => {
        const currentStep = (state.get('page') as string) || '1';
        state.set('page', (parseInt(currentStep) + 1).toString());

        const currentShowedPages = showedPages + 5;

        if (parseInt(currentStep) + 1 > currentShowedPages) {
          state.set('showedPages', (showedPages + 5).toString());
        }

        return state;
      });
    }
  }, [canGoToNextStep, setSearchParms, showedPages]);

  const goToPrevPage = useCallback(() => {
    if (canGoToPrevStep) {
      setSearchParms((state) => {
        const currentStep = state.get('page') as string;
        state.set('page', (parseInt(currentStep) - 1).toString());

        if (parseInt(currentStep) - 1 <= showedPages) {
          state.set('showedPages', (showedPages - 5).toString());
        }

        return state;
      });
    }
  }, [canGoToPrevStep, setSearchParms, showedPages]);

  const updateStep = useCallback<setStepCallbackType>(
    (step) => {
      setPage(step);
    },
    [setPage],
  );

  const removeFilterQuery = useCallback(
    (name: string) => {
      setSearchParms((state) => {
        state.delete(name);

        return state;
      });
    },
    [setSearchParms],
  );

  const updateQueryFilters = useCallback(
    (filter: Record<string, unknown>) => {
      const [key, value] = Object.entries(filter)[0];

      if (!(value as string).length) {
        removeFilterQuery(key);
        return;
      }

      setSearchParms((state) => {
        state.set(key, value as string);

        return state;
      });
    },
    [removeFilterQuery, setSearchParms],
  );

  const updateSortDirection = useCallback(
    (filter: Record<string, string>) => {
      const [key, value] = Object.entries(filter)[0];

      setSearchParms((state) => {
        state.set(`${key}.order`, value as string);

        return state;
      });
    },
    [setSearchParms],
  );

  return {
    data,
    pagination: {
      goToNextPage,
      goToPrevPage,
      updateStep,
      currentPage,
    },
    reload: refetch,
    updateQueryFilters,
    updateSortDirection,
    removeFilterQuery,
  };
};

export default useList;
