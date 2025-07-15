import { useCallback, useState } from 'react';

export interface FetchedNutritionData {
  name: string;
  protein_g: number;
  carbohydrates_total_g: number;
  fat_total_g: number;
}

const OPENAI_API_KEY = import.meta.env.VITE_API_OPENAI_KEY;

const SYSTEM_PROMPT = `Você é um assistente de nutrição especialista. Sua única função é retornar os macronutrientes aproximados para o alimento solicitado, em um formato JSON. Forneça os valores de proteína, carboidratos e gorduras totais em gramas, assumindo uma porção padrão de 100g. Sua resposta DEVE SER APENAS o objeto JSON, sem nenhum texto, introdução ou explicação adicional. O formato do JSON deve ser: {"protein_g": <valor_numerico>, "carbohydrates_total_g": <valor_numerico>, "fat_total_g": <valor_numerico>}. Se o alimento não for reconhecido ou for ambíguo, retorne {"protein_g": 0, "carbohydrates_total_g": 0, "fat_total_g": 0}.`;

export const useNutritionApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNutritionData = useCallback(async (query: string): Promise<FetchedNutritionData[]> => {
    if (!query.trim()) {
      setError('Por favor, digite o nome de um alimento.');
      return [];
    }
    if (!OPENAI_API_KEY) {
      setError('A chave da API da OpenAI (VITE_API_OPENAI_KEY) não está configurada.');
      return [];
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo-1106',
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: query },
          ],
          temperature: 0,
          seed: 42,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro na comunicação com a API da OpenAI.');
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;

      if (content) {
        const parsedContent = JSON.parse(content);
        const result: FetchedNutritionData = {
          name: query,
          protein_g: parsedContent.protein_g || 0,
          carbohydrates_total_g: parsedContent.carbohydrates_total_g || 0,
          fat_total_g: parsedContent.fat_total_g || 0,
        };
        return [result];
      } else {
        throw new Error('A resposta da API está em um formato inesperado.');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocorreu um erro inesperado.');
      }
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isLoading, error, fetchNutritionData, setError };
};
