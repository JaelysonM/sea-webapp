import { useCallback, useState } from 'react';
import { api } from 'apis';

interface CreateFoodData {
  name: string;
  description?: string;
  photo?: File | string;
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
}

interface CreateFoodResponse {
  id: number;
  name: string;
  description: string;
  photo: string;
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
  scale: null;
}

const useCreateFood = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createFood = useCallback(
    async (data: CreateFoodData): Promise<CreateFoodResponse | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const formData = new FormData();

        formData.append('name', data.name);
        formData.append('protein', data.protein.toString());
        formData.append('carbs', data.carbs.toString());
        formData.append('fat', data.fat.toString());
        formData.append('calories', data.calories.toString());

        if (data.description) {
          formData.append('description', data.description);
        }

        if (data.photo instanceof File) {
          formData.append('photo', data.photo);
        }

        const response = await api.post<CreateFoodResponse>('/foods', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        return response.data;
      } catch (err: unknown) {
        const errorMessage =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          'Erro ao criar alimento';
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return {
    createFood,
    isLoading,
    error,
    setError,
  };
};

export default useCreateFood;
