import { useCallback, useState } from 'react';
import { api } from 'apis';

export interface FetchedNutritionData {
  protein_g: number;
  carbohydrates_total_g: number;
  fat_total_g: number;
}

interface NutritionApiRequest {
  food_name: string;
}

export const useAuthenticatedNutritionApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNutritionData = useCallback(
    async (foodName: string): Promise<FetchedNutritionData[]> => {
      if (!foodName.trim()) {
        setError('Por favor, digite o nome de um alimento.');
        return [];
      }

      setIsLoading(true);
      setError(null);

      try {
        const requestData: NutritionApiRequest = {
          food_name: foodName,
        };

        const response = await api.post<FetchedNutritionData>(
          '/foods/calculate-nutrition',
          requestData,
        );

        if (response.data) {
          const result: FetchedNutritionData = {
            protein_g: response.data.protein_g || 0,
            carbohydrates_total_g: response.data.carbohydrates_total_g || 0,
            fat_total_g: response.data.fat_total_g || 0,
          };
          return [result];
        } else {
          throw new Error('Resposta da API em formato inesperado.');
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Ocorreu um erro inesperado ao calcular os macronutrientes.');
        }
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return { isLoading, error, fetchNutritionData, setError };
};
