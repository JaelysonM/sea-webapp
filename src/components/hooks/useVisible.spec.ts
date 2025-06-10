import { act, renderHook } from '@testing-library/react-hooks';

import useVisible from './useVisible';

test('useVisible should return the initial state and update the state correctly', () => {
  const initialState = true;
  const { result } = renderHook(() => useVisible(initialState));
  expect(result.current.visible).toBe(initialState);

  act(() => {
    result.current.setVisible(false);
  });
  expect(result.current.visible).toBe(false);

  act(() => {
    result.current.setVisible(true);
  });
  expect(result.current.visible).toBe(true);
});

test('useVisible should reinitialize the state when initialState changes', () => {
  const { result, rerender } = renderHook(({ initialState }) => useVisible(initialState), {
    initialProps: { initialState: true },
  });

  expect(result.current.visible).toBe(true);

  rerender({ initialState: false });

  expect(result.current.visible).toBe(false);
});
