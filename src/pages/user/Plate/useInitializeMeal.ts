import { useCallback, useState } from 'react';
import { api } from 'apis';

interface InitializeMealData {
  plate_identifier: string;
}

interface InitializeMealResponse {
  id: number;
  plate_identifier: string;
  user_id: number;
  status: string;
  created_at: string;
  updated_at: string;
}

const useInitializeMeal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initializeMeal = useCallback(
    async (data: InitializeMealData): Promise<InitializeMealResponse | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await api.post<InitializeMealResponse>('/auth/meals/initialize', data);
        return response.data;
      } catch (err: unknown) {
        const errorMessage =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          'Erro ao inicializar refeição';
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return {
    initializeMeal,
    isLoading,
    error,
    setError,
  };
};

export default useInitializeMeal;
