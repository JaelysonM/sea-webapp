import { useCallback, useState } from 'react';
import { ProcessedFood } from '@types';
import { useRequest } from 'apis';
import { FoodProcessor } from 'processors';

interface ResetProgress {
  total: number;
  completed: number;
  current?: string;
  errors: Array<{ foodId: number; foodName: string; error: string }>;
}

const useResetMenu = () => {
  const [isResetting, setIsResetting] = useState(false);
  const [progress, setProgress] = useState<ResetProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  const request = useRequest();

  const resetScale = useCallback(
    async (foodId: number): Promise<boolean> => {
      return new Promise((resolve) => {
        const formData = new FormData();
        formData.append('scale_id', '0'); // Mandando 0 para desanexar/resetar

        request({
          method: 'PUT',
          url: `/foods/${foodId}`,
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onSuccess: () => {
            resolve(true);
          },
          onError: (err) => {
            console.error(`Erro ao resetar food ${foodId}:`, err);
            resolve(false);
          },
        });
      });
    },
    [request],
  );

  const resetMenu = useCallback(
    async (foods: ProcessedFood[]): Promise<void> => {
      setIsResetting(true);
      setError(null);

      try {
        // Filtrar apenas alimentos ativos
        const activeFoods = FoodProcessor.getActiveFoods(foods);

        if (activeFoods.length === 0) {
          setError('Nenhum alimento ativo encontrado para reiniciar.');
          return;
        }

        setProgress({
          total: activeFoods.length,
          completed: 0,
          errors: [],
        });

        // Processar cada alimento ativo
        for (let i = 0; i < activeFoods.length; i++) {
          const food = activeFoods[i];

          setProgress((prev) => ({
            ...prev!,
            current: food.name,
          }));

          const success = await resetScale(food.id);

          setProgress((prev) => ({
            ...prev!,
            completed: prev!.completed + 1,
            current: undefined,
            errors: success
              ? prev!.errors
              : [
                  ...prev!.errors,
                  {
                    foodId: food.id,
                    foodName: food.name,
                    error: 'Falha ao resetar alimento',
                  },
                ],
          }));

          // Pequena pausa entre as requisições
          if (i < activeFoods.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, 300));
          }
        }
      } catch (err) {
        setError('Erro inesperado durante o reset do menu.');
        console.error('Erro no reset do menu:', err);
      } finally {
        setIsResetting(false);
      }
    },
    [resetScale],
  );

  return {
    resetMenu,
    isResetting,
    progress,
    error,
    setError,
  };
};

export default useResetMenu;
