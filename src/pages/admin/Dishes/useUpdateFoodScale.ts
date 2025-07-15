import { useCallback, useState } from 'react';
import { useRequest } from 'apis';

const useUpdateFoodScale = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = useRequest();

  const updateFoodScale = useCallback(
    async (foodId: number, scaleId: number | null): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        const formData = new FormData();
        formData.append('scale_id', (scaleId === null ? 0 : scaleId).toString());

        await request({
          method: 'PUT',
          url: `/foods/${foodId}`,
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onSuccess: () => {
            setIsLoading(false);
          },
          onError: (err) => {
            const errorMessage =
              (err?.response?.data as { message?: string })?.message ||
              'Erro ao atualizar balança do alimento';
            setError(errorMessage);
            setIsLoading(false);
          },
        });
        return true;
      } catch (err: unknown) {
        return false;
      }
    },
    [request],
  );

  return {
    updateFoodScale,
    isLoading,
    error,
    setError,
  };
};

export default useUpdateFoodScale;
