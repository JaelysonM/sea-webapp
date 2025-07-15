import { useMemo } from 'react';
import { Food } from '@types';
import { FoodProcessor } from 'processors';

import { useInfinityList } from 'components/hooks';

type Props = {
  page_size?: number;
  page?: number;
};

const useFoodsList = ({ page_size, page }: Props = {}) => {
  const {
    data: rawFoods,
    refetch,
    fetchNextPage,
    isLoading,
    hasNextPage,
  } = useInfinityList<Food>({
    baseUrl: '/foods',
    page_size,
    page,
  });

  const processedFoods = useMemo(() => {
    return FoodProcessor.processFoodList(rawFoods);
  }, [rawFoods]);

  const activeFoods = useMemo(() => {
    return FoodProcessor.getActiveFoods(processedFoods);
  }, [processedFoods]);

  const inactiveFoods = useMemo(() => {
    return FoodProcessor.getInactiveFoods(processedFoods);
  }, [processedFoods]);

  const foodStats = useMemo(() => {
    return FoodProcessor.getFoodStats(processedFoods);
  }, [processedFoods]);

  return {
    rawFoods,
    processedFoods,
    activeFoods,
    inactiveFoods,
    foodStats,
    refetch,
    fetchNextPage,
    isLoading,
    hasNextPage,
  };
};

export default useFoodsList;
