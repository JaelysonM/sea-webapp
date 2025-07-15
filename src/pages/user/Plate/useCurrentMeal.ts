import { useCallback, useEffect, useState } from 'react';
import { Meal, ProcessedMeal } from '@types';
import { useRequest } from 'apis';
import { MealProcessor } from 'processors';

const useCurrentMeal = (pollingInterval = 3000) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meal, setMeal] = useState<Meal | null>(null);
  const [processedMeal, setProcessedMeal] = useState<ProcessedMeal>(() =>
    MealProcessor.processMeal(null),
  );
  const [shouldPoll, setShouldPoll] = useState(true);

  const request = useRequest();

  const fetchCurrentMeal = useCallback(async () => {
    try {
      await request<Meal>({
        method: 'GET',
        url: '/auth/meals/current',
        onSuccess: (data) => {
          setMeal(data);
          setProcessedMeal(MealProcessor.processMeal(data));
          setError(null);
          setIsLoading(false);
          setShouldPoll(true); // Continuar polling quando tiver sucesso
        },
        onError: (err) => {
          console.error('Erro ao carregar refeição atual:', err);
          setMeal(null);
          setProcessedMeal(MealProcessor.processMeal(null));
          setError('Erro ao carregar dados da refeição');
          setIsLoading(false);

          // Parar polling se for erro 404 (sem refeição ativa)
          if (err && typeof err === 'object' && 'status' in err && err.status === 404) {
            setShouldPoll(false);
          } else {
            setShouldPoll(true); // Continuar polling para outros erros
          }
        },
      });
    } catch (err) {
      console.error('Erro ao buscar refeição:', err);
      setMeal(null);
      setProcessedMeal(MealProcessor.processMeal(null));
      setError('Erro ao carregar dados da refeição');
      setIsLoading(false);
      setShouldPoll(true); // Continuar polling para erros de catch
    }
  }, [request]);

  useEffect(() => {
    fetchCurrentMeal();
  }, [fetchCurrentMeal]);

  useEffect(() => {
    if (pollingInterval <= 0 || !shouldPoll) return;

    const interval = setInterval(() => {
      fetchCurrentMeal();
    }, pollingInterval);

    return () => clearInterval(interval);
  }, [fetchCurrentMeal, pollingInterval, shouldPoll]);

  const refetch = useCallback(() => {
    setIsLoading(true);
    setShouldPoll(true); // Reativar polling quando refetch for chamado manualmente
    fetchCurrentMeal();
  }, [fetchCurrentMeal]);

  return {
    meal,
    processedMeal,
    isLoading,
    error,
    refetch,
  };
};

export default useCurrentMeal;
