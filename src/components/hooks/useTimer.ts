import { useCallback, useEffect, useReducer, useRef } from 'react';

const reducer = (state: { time: number }, action: { type: 'UPDATE' }) => {
  switch (action.type) {
    case 'UPDATE':
      return {
        ...state,
        time: new Date().getTime(),
      };
    default:
      return state;
  }
};

const useTimer = (timeout: number) => {
  const [{ time }, dispatch] = useReducer(reducer, { time: 0 });

  const timerRef = useRef<NodeJS.Timeout>();
  const activeRef = useRef(time);

  const active = activeRef.current !== time ? time : 0;
  activeRef.current = time;

  const startTimer = useCallback(() => {
    if (timeout > 0) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => dispatch({ type: 'UPDATE' }), timeout);
    }
  }, [timeout]);

  useEffect(
    () => () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    },
    [],
  );

  return { timeout: active, startTimer };
};

export default useTimer;
