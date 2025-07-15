import { useCallback, useState } from 'react';
import { api } from 'apis';

const useDeleteFood = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteFood = useCallback(async (id: number): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      await api.delete(`/foods/${id}`);
      return true;
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Erro ao deletar alimento';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    deleteFood,
    isLoading,
    error,
    setError,
  };
};

export default useDeleteFood;
