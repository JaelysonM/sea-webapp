import React from 'react';

import { useHorizontalScroll } from 'components/hooks';

import styles from './ScrollableNav.module.scss';

interface ScrollableNavProps {
  children: React.ReactNode;
  className?: string;
  activeSelector?: string;
  centerActive?: boolean;
}

const ScrollableNav: React.FC<ScrollableNavProps> = ({
  children,
  className = '',
  activeSelector,
  centerActive = true,
}) => {
  const scrollRef = useHorizontalScroll({ activeSelector, centerActive });

  return (
    <div className={`${styles.scrollContainer} ${className}`} ref={scrollRef}>
      {children}
    </div>
  );
};

export default ScrollableNav;
