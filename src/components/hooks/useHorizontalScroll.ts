import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

interface UseHorizontalScrollOptions {
  activeSelector?: string;
  centerActive?: boolean;
  smoothScroll?: boolean;
}

const useHorizontalScroll = (options: UseHorizontalScrollOptions = {}) => {
  const {
    activeSelector = '[aria-current="page"]',
    centerActive = true,
    smoothScroll = true,
  } = options;

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const activeElement = scrollContainerRef.current?.querySelector(activeSelector) as HTMLElement;

    if (activeElement && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const elementRect = activeElement.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      if (elementRect.left < containerRect.left || elementRect.right > containerRect.right) {
        let scrollLeft = activeElement.offsetLeft;

        if (centerActive) {
          scrollLeft =
            activeElement.offsetLeft - container.offsetWidth / 2 + activeElement.offsetWidth / 2;
        }

        container.scrollTo({
          left: scrollLeft,
          behavior: smoothScroll ? 'smooth' : 'auto',
        });
      }
    }
  }, [location.pathname, activeSelector, centerActive, smoothScroll]);

  return scrollContainerRef;
};

export default useHorizontalScroll;
