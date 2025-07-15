import React, { ReactNode } from 'react';
import { animated, useSpring } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';

import styles from './SwipeableContainer.module.scss';

interface SwipeableContainerProps {
  children: ReactNode;
  leftSwipeAction?: {
    icon: ReactNode;
    background: string;
    onSwipe: () => void;
  };
  rightSwipeAction?: {
    icon: ReactNode;
    background: string;
    onSwipe: () => void;
  };
}

const SwipeableContainer: React.FC<SwipeableContainerProps> = ({
  children,
  leftSwipeAction,
  rightSwipeAction,
}) => {
  const [{ x, background }, api] = useSpring(() => ({
    x: 0,
    background: 'transparent',
    config: { mass: 0.1, tension: 250, friction: 25 },
  }));

  const bind = useDrag(
    ({ active, movement: [mx], direction: [xDir], cancel }) => {
      const absMx = Math.abs(mx);
      const trigger = absMx > window.innerWidth / 3; // Ajuste a sensibilidade conforme necessário

      if (active && trigger) {
        if (xDir > 0 && leftSwipeAction) {
          leftSwipeAction.onSwipe();
        } else if (xDir < 0 && rightSwipeAction) {
          rightSwipeAction.onSwipe();
        }
        cancel();
      }

      api.start({
        x: active ? mx : 0,
        background: (() => {
          if (mx < 0 && rightSwipeAction) {
            return rightSwipeAction.background;
          }
          if (mx > 0 && leftSwipeAction) {
            return leftSwipeAction.background;
          }

          return 'transparent';
        })(),
        immediate: active,
      });
    },
    { filterTaps: true, axis: 'x', from: () => [x.get(), 0] },
  );

  return (
    <div className={styles.swipeContainer}>
      <animated.div className={styles.swipeBackground} style={{ background }}>
        <div className={styles.swipeActionLeft}>{leftSwipeAction?.icon}</div>
        <div className={styles.swipeActionRight}>{rightSwipeAction?.icon}</div>
      </animated.div>
      <animated.div className={styles.swipeForeground} {...bind()} style={{ x }}>
        {children}
      </animated.div>
    </div>
  );
};

export default SwipeableContainer;
