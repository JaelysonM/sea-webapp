// useQueryParams.ts
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

type QueryParams = Record<string, string | null>;

export default function useQueryParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const get = useMemo(() => {
    const result: QueryParams = {};
    for (const [key, value] of searchParams.entries()) {
      result[key] = value;
    }
    return result;
  }, [searchParams]);

  const set = (params: Record<string, string | number | null | undefined>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === undefined) {
        newParams.delete(key);
      } else {
        newParams.set(key, String(value));
      }
    });
    setSearchParams(newParams);
  };

  return { get, set };
}
