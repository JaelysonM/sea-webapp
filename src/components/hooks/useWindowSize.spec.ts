import { act, renderHook } from '@testing-library/react-hooks';

import useWindowSize from './useWindowSize';

// Mocking window.innerWidth and window.innerHeight
const mockWindowSize = {
  width: 1024,
  height: 768,
};

beforeEach(() => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: mockWindowSize.width,
  });

  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: mockWindowSize.height,
  });
});

test('useWindowSize should return the initial window size', () => {
  const { result } = renderHook(() => useWindowSize());

  expect(result.current).toEqual(mockWindowSize);
});

test('useWindowSize should update the window size when the window is resized', () => {
  const { result } = renderHook(() => useWindowSize());

  act(() => {
    // Simulate a window resize event
    window.innerWidth = 800;
    window.innerHeight = 600;
    window.dispatchEvent(new Event('resize'));
  });

  expect(result.current).toEqual({ width: 800, height: 600 });
});
