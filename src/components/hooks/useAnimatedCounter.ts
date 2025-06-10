import { useEffect, useRef, useState } from 'react';

const defaultEasing = (progress: number): number => 1 - Math.pow(1 - progress, 3);

function useAnimatedCounter(
  targetValue: number,
  durationMs: number = 700,
  initialDisplayValue: number = 0,
): number {
  const [displayValue, setDisplayValue] = useState<number>(initialDisplayValue);
  const animationFrameId = useRef<number | null>(null);
  const targetValueRef = useRef(targetValue);

  useEffect(() => {
    const startAnimationValue = displayValue;
    const endAnimationValue = targetValue;

    targetValueRef.current = targetValue;

    if (startAnimationValue === endAnimationValue) {
      if (displayValue !== endAnimationValue) setDisplayValue(endAnimationValue);
      return;
    }

    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (targetValueRef.current !== endAnimationValue) {
        if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        return;
      }

      if (startTime === null) startTime = timestamp;
      const elapsedTime = timestamp - startTime;
      const progress = Math.min(elapsedTime / durationMs, 1);
      const easedProgress = defaultEasing(progress);

      const currentValue = Math.round(
        startAnimationValue + (endAnimationValue - startAnimationValue) * easedProgress,
      );
      setDisplayValue(currentValue);

      if (progress < 1) {
        animationFrameId.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(endAnimationValue);
      }
    };

    if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [targetValue, durationMs, displayValue]);

  useEffect(() => {
    setDisplayValue(initialDisplayValue);
  }, [initialDisplayValue]);

  return displayValue;
}

export default useAnimatedCounter;
