import { renderHook } from '@testing-library/react-hooks';

import useFirstRender from './useFirstRender';

test('should return true on the first render and false on subsequent renders', () => {
  const { result, rerender } = renderHook(() => useFirstRender());
  expect(result.current).toBe(true);

  rerender();

  expect(result.current).toBe(false);
});
