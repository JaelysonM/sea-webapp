import React from 'react';
import { Modal } from 'react-bootstrap';

import { PieChartSliceData } from 'components/elements/PieChart/PieChart';
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
    <div style={{ position: 'relative', width: size, height: size }}>
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

interface MacroDetailsModalProps {
  show: boolean;
  onHide: () => void;
  slice: PieChartSliceData | null;
  totalMacros: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

const MacroDetailsModal: React.FC<MacroDetailsModalProps> = ({
  show,
  onHide,
  slice,
  totalMacros,
}) => {
  if (!slice) return null;

  const animatedProtein = useAnimatedCounter(totalMacros.protein, 700);
  const animatedCarbs = useAnimatedCounter(totalMacros.carbs, 700);
  const animatedFat = useAnimatedCounter(totalMacros.fat, 700);

  const totalMacroWeight = totalMacros.protein + totalMacros.carbs + totalMacros.fat;
  const proteinPercentage =
    totalMacroWeight > 0 ? Math.round((totalMacros.protein / totalMacroWeight) * 100) : 0;
  const carbsPercentage =
    totalMacroWeight > 0 ? Math.round((totalMacros.carbs / totalMacroWeight) * 100) : 0;
  const fatPercentage =
    totalMacroWeight > 0 ? Math.round((totalMacros.fat / totalMacroWeight) * 100) : 0;

  const animatedProteinPercentage = useAnimatedCounter(proteinPercentage, 700);
  const animatedCarbsPercentage = useAnimatedCounter(carbsPercentage, 700);
  const animatedFatPercentage = useAnimatedCounter(fatPercentage, 700);

  const macroData = [
    {
      name: 'Proteínas',
      value: animatedProtein,
      percentage: animatedProteinPercentage,
      calories: Math.round(animatedProtein * 4),
      color: 'var(--bs-danger)',
      icon: 'bi bi-egg',
    },
    {
      name: 'Carboidratos',
      value: animatedCarbs,
      percentage: animatedCarbsPercentage,
      calories: Math.round(animatedCarbs * 4),
      color: 'var(--bs-primary)',
      icon: 'bi bi-lightning-charge-fill',
    },
    {
      name: 'Gorduras',
      value: animatedFat,
      percentage: animatedFatPercentage,
      calories: Math.round(animatedFat * 9),
      color: 'var(--bs-warning)',
      icon: 'bi bi-droplet-half',
    },
  ];

  return (
    <Modal show={show} onHide={onHide} centered size='sm'>
      <Modal.Header closeButton className='border-0 pb-2'>
        <Modal.Title className='fs-5 fw-bold'>Macros Prato</Modal.Title>
      </Modal.Header>
      <Modal.Body className='pt-0 px-4'>
        <div className='d-flex flex-column gap-4'>
          {macroData.map((macro) => (
            <div
              key={macro.name}
              className='d-flex align-items-center justify-content-between w-100'
            >
              {/* Gráfico donut animado */}
              <div className='d-flex justify-content-center flex-shrink-0'>
                <AnimatedDonutChart
                  percentage={macro.percentage}
                  size={60}
                  strokeWidth={9}
                  color={macro.color}
                  iconClassName={macro.icon}
                />
              </div>

              {/* Informações do macro */}
              <div className='flex-grow-1 text-center mx-3'>
                <div
                  className='text-secondary mb-1'
                  style={{ fontSize: '0.75rem', fontWeight: 500 }}
                >
                  {macro.name}
                </div>
                <h2
                  className='fw-bolder text-dark mb-1'
                  style={{ fontSize: '1.6rem', lineHeight: '1.1' }}
                >
                  {Math.round(macro.value).toLocaleString('pt-BR')}g
                </h2>
                <h3 className='text-muted m-0' style={{ fontSize: '0.75rem' }}>
                  {macro.calories.toLocaleString('pt-BR')} kcal
                </h3>
              </div>

              {/* Porcentagem */}
              <div className='text-end flex-shrink-0' style={{ minWidth: '40px' }}>
                <span className='fw-bold text-dark' style={{ fontSize: '1.1rem' }}>
                  {Math.round(macro.percentage)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default MacroDetailsModal;
