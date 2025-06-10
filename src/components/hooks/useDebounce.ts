/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useRef, useState } from 'react';
import { DebouncedFunc, DebounceSettings } from 'lodash';
import debounce from 'lodash.debounce';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 0,
  options?: DebounceSettings,
): DebouncedFunc<T> {
  return useCallback(debounce(callback, delay, options), [callback, delay, options]);
}

export default function useDebounce<T>(value: T, delay: number = 0, options?: DebounceSettings): T {
  const previousValue = useRef(value);
  const [current, setCurrent] = useState(value);

  const debouncedCallback = useDebouncedCallback((value: T) => setCurrent(value), delay, options);

  useEffect(() => {
    // doesn't trigger the debounce timer initially
    if (value !== previousValue.current) {
      debouncedCallback(value);
      previousValue.current = value;
      // cancel the debounced callback on clean up
      return debouncedCallback.cancel;
    }
  }, [debouncedCallback, value]);

  return current;
}
