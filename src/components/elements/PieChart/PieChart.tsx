import React from 'react';
import { Button, OverlayTrigger, Popover } from 'react-bootstrap';

export interface PieChartSliceData {
  id: string | number;
  percentage: number;
  color?: string;
  imageSrc?: string;
  label?: string;
  details?: React.ReactNode;
}

interface PieChartProps {
  slices: PieChartSliceData[];
  size?: number;
  className?: string;
  onSliceDetailClick?: (slice: PieChartSliceData) => void;
}

const PieChart: React.FC<PieChartProps> = ({
  slices,
  size = 150,
  className = '',
  onSliceDetailClick,
}) => {
  const radius = size / 2;
  const center = radius;
  let cumulativePercentage = 0;

  const getCoordinatesForPercent = (percent: number) => {
    const x = center + radius * Math.cos(2 * Math.PI * percent - Math.PI / 2);
    const y = center + radius * Math.sin(2 * Math.PI * percent - Math.PI / 2);
    return [x, y];
  };

  return (
    <div style={{ position: 'relative', width: size, height: size }} className={className}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          {slices.map((slice) => {
            if (slice.imageSrc) {
              const patternId = `pattern-${slice.id}`;
              return (
                <pattern
                  key={patternId}
                  id={patternId}
                  patternUnits='userSpaceOnUse'
                  width={size}
                  height={size}
                >
                  <image
                    href={slice.imageSrc}
                    x='0'
                    y='0'
                    width={size}
                    height={size}
                    preserveAspectRatio='xMidYMid slice'
                  />
                </pattern>
              );
            }
            return null;
          })}
        </defs>
        {slices.map((slice) => {
          const [startX, startY] = getCoordinatesForPercent(cumulativePercentage / 100);
          const currentSlicePercentage = slice.percentage;
          cumulativePercentage += currentSlicePercentage;
          const [endX, endY] = getCoordinatesForPercent(cumulativePercentage / 100);

          const largeArcFlag = currentSlicePercentage > 50 ? 1 : 0;

          const pathD = [
            `M ${center},${center}`,
            `L ${startX},${startY}`,
            `A ${radius},${radius} 0 ${largeArcFlag} 1 ${endX},${endY}`,
            'Z',
          ].join(' ');

          const fillType = slice.imageSrc ? `url(#pattern-${slice.id})` : slice.color;

          const slicePopover = (
            <Popover id={`popover-slice-${slice.id}`} placement='auto'>
              <Popover.Body className='d-flex flex-row align-items-center justify-content-between gap-2 p-2'>
                <p className='mb-0' style={{ color: '#68717A' }}>
                  {slice.label} {slice.details}
                </p>
                {onSliceDetailClick && (
                  <Button
                    variant='link'
                    size='sm'
                    onClick={(e) => {
                      e.stopPropagation();
                      onSliceDetailClick(slice);
                      document.body.click();
                    }}
                    className='p-0 d-flex align-items-center'
                    style={{ color: 'var(--bs-primary)' }}
                  >
                    <i
                      className='bi bi-eye-fill'
                      style={{ marginRight: '0.3rem', verticalAlign: 'middle', fontSize: '1rem' }}
                      aria-hidden='true'
                    ></i>
                  </Button>
                )}
              </Popover.Body>
            </Popover>
          );

          return (
            <OverlayTrigger
              key={slice.id}
              trigger='click'
              rootClose
              placement='auto'
              overlay={slicePopover}
            >
              <path d={pathD} fill={fillType || 'transparent'} style={{ cursor: 'pointer' }} />
            </OverlayTrigger>
          );
        })}
      </svg>
    </div>
  );
};

export default PieChart;
