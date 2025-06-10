import { useEffect } from 'react';
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import { api } from 'apis';
import { queryClient } from 'apis/queryClient';

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
};

const useList = <T>({ baseUrl }: Props) => {
  async function queryFn({ currentPage = 1 }) {
    const { data } = await api.get(`${baseUrl}?page_size=10&page=${currentPage}`);
    return data;
  }

  const useListQuery = <T>() => {
    return useInfiniteQuery<T>({
      queryKey: [baseUrl],
      queryFn: ({ pageParam = 1 }) => queryFn({ currentPage: pageParam as number }),
      getNextPageParam: (lastPage) => (lastPage as Pageable<T>).options.page + 1,
      initialPageParam: 1,
      placeholderData: keepPreviousData,
      staleTime: Infinity,
    });
  };

  const {
    data: inifinteQueryList,
    refetch,
    fetchNextPage,
    isLoading,
    hasNextPage,
  } = useListQuery<Pageable<T>>();

  const paginatedData = [] as T[];
  inifinteQueryList?.pages.forEach((page) => {
    page.data.forEach((char) => {
      paginatedData.push(char);
    });
  });

  useEffect(() => {
    return () => {
      queryClient.cancelQueries({ queryKey: [baseUrl] });
      queryClient.removeQueries({ queryKey: [baseUrl] });
      queryClient.invalidateQueries({ queryKey: [baseUrl] });
    };
  }, [baseUrl]);

  return {
    data: paginatedData,
    refetch,
    fetchNextPage,
    isLoading,
    hasNextPage,
  };
};

export default useList;
