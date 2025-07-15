import React from 'react';
import { Card } from 'react-bootstrap';

import { useAnimatedCounter } from 'components/hooks';

interface AnimatedDonutChartProps {
  percentage: number;
  size: number;
  strokeWidth: number;
  color: string;
  iconClassName: string;
}

const AnimatedDonutChart: React.FC<AnimatedDonutChartProps> = ({
  percentage,
  size,
  strokeWidth,
  color,
  iconClassName,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percentage / 100);
  const center = size / 2;
  const iconSize = size * 0.33;

  return (
    <div style={{ position: 'relative', width: size, height: size, margin: '0.75rem auto' }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: 'rotate(-90deg)' }}
      >
        <circle
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
          stroke='var(--bs-gray-200)'
          fill='transparent'
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={color}
          fill='transparent'
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap='round'
          style={{ transition: 'stroke-dashoffset 0.7s ease-out' }}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: `${iconSize}px`,
          color: color,
          lineHeight: '1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <i className={iconClassName}></i>
      </div>
    </div>
  );
};

interface NutrientStatCardProps {
  label: string;
  unit: string;
  iconClassName: string;
  color: string;

  className?: string;
  animationDuration?: number;
  data: {
    percentage: number;
    calories: number;
    weight: number;
  };
}

const NutrientStatCard: React.FC<NutrientStatCardProps> = ({
  label,
  unit,
  data,
  iconClassName,
  color,

  className = '',
  animationDuration = 700,
}) => {
  const animatedWeight = useAnimatedCounter(data.weight, animationDuration);
  const animatedPercentage = useAnimatedCounter(data.percentage, animationDuration);

  const formattedQuantity = animatedWeight.toLocaleString('pt-BR');

  return (
    <Card
      border='light'
      className={`text-center shadow-sm ${className}`}
      style={{ borderRadius: '0.60rem' }}
    >
      <Card.Body style={{ padding: '1.3rem' }}>
        <div className='text-secondary mb-2' style={{ fontSize: '0.75rem', fontWeight: 500 }}>
          {label}
        </div>
        <AnimatedDonutChart
          percentage={animatedPercentage}
          size={60}
          strokeWidth={9}
          color={color}
          iconClassName={iconClassName}
        />
        <h2 className='fw-bolder text-dark mt-2' style={{ fontSize: '1.8rem', lineHeight: '1.1' }}>
          {formattedQuantity}
          {unit}
        </h2>
        <h3 className='text-muted m-0' style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
          {data.calories.toLocaleString('pt-BR')} kcal
        </h3>
      </Card.Body>
    </Card>
  );
};

export default NutrientStatCard;
