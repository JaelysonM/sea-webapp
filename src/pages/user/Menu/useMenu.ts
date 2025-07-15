import { Food } from '@types';
import { useFetch } from 'apis';

import type { Pageable } from 'components/hooks/useInfinityList';

const useMenu = () => {
  const { data, loading, reload } = useFetch<Pageable<Food>>('/auth/foods/menu');

  const menuItems = data && !(data instanceof Error) ? data.data : [];

  return {
    menuItems,
    isLoading: loading,
    error: data instanceof Error ? data : null,
    refetch: reload,
  };
};

export default useMenu;
