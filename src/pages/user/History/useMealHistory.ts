import { useCallback, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { api } from 'apis';

export interface FoodMeasurement {
  id: number;
  food: {
    id: number;
    name: string;
    description: string;
    photo: string;
    protein: number;
    carbs: number;
    fat: number;
    calories: number;
    scale: {
      id: number;
      name: string;
      serial: string;
    };
  };
  weight: number;
}

export interface MealHistory {
  id: number;
  created_at: string;
  finished: boolean;
  final_price: number;
  total_calories: number;
  total_carbs: number;
  total_fat: number;
  total_protein: number;
  total_weight: number;
  food_measurements: FoodMeasurement[];
}

export interface MealHistoryResponse {
  data: MealHistory[];
  options: {
    page: number;
    pages: number;
    results: number;
    size: number;
  };
}

const useMealHistory = (pageSize: number = 10) => {
  const [error, setError] = useState<string | null>(null);

  const fetchMealHistory = useCallback(
    async ({ pageParam = 1 }): Promise<MealHistoryResponse> => {
      try {
        setError(null);
        const response = await api.get<MealHistoryResponse>('/auth/meals', {
          params: {
            page: pageParam,
            size: pageSize,
          },
        });
        return response.data;
      } catch (err) {
        const errorMessage = 'Erro ao carregar histórico de refeições';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [pageSize],
  );

  const {
    data,
    error: queryError,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['mealHistory', pageSize],
    queryFn: fetchMealHistory,
    getNextPageParam: (lastPage) => {
      const { page, pages } = lastPage.options;
      return page < pages ? page + 1 : undefined;
    },
    initialPageParam: 1,
  });

  // Flatten all pages into a single array
  const meals = data?.pages.flatMap((page) => page.data) || [];
  const totalResults = data?.pages[0]?.options.results || 0;

  return {
    meals,
    totalResults,
    error: error || (queryError?.message ?? null),
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
    refetch,
  };
};

export default useMealHistory;
