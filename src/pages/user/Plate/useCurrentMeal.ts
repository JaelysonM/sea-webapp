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
  const [isTabActive, setIsTabActive] = useState(!document.hidden);

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
          setShouldPoll(true);
        },
        onError: (err) => {
          setMeal(null);
          setProcessedMeal(MealProcessor.processMeal(null));
          setError('Erro ao carregar dados da refeição');
          setIsLoading(false);

          if (err && typeof err === 'object' && 'status' in err && err.status === 404) {
            setShouldPoll(false);
          } else {
            setShouldPoll(true);
          }
        },
      });
    } catch (err) {
      setMeal(null);
      setProcessedMeal(MealProcessor.processMeal(null));
      setError('Erro ao carregar dados da refeição');
      setIsLoading(false);
      setShouldPoll(true);
    }
  }, [request]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabActive(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  useEffect(() => {
    fetchCurrentMeal();
  }, [fetchCurrentMeal]);

  useEffect(() => {
    if (pollingInterval <= 0 || !shouldPoll || !isTabActive) return;

    const interval = setInterval(() => {
      fetchCurrentMeal();
    }, pollingInterval);

    return () => clearInterval(interval);
  }, [fetchCurrentMeal, pollingInterval, shouldPoll, isTabActive]);

  const refetch = useCallback(() => {
    setIsLoading(true);
    setShouldPoll(true);
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
