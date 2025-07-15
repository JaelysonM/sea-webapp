import React from 'react';
import { Card, Container } from 'react-bootstrap';

import { useAnimatedCounter } from 'components/hooks';

interface Props {
  title: string;
  calories: number;
  unit?: string;
  className?: string;
}

const CalorieDisplayCard: React.FC<Props> = ({
  title,
  calories,
  unit = 'kcal',
  className = '',
}) => {
  const displayCalories = useAnimatedCounter(calories, 350);

  const formattedDisplayCalories = displayCalories.toLocaleString('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return (
    <Card
      border='light'
      className={`shadow-sm ${className}`}
      style={{ borderRadius: '0.60rem', maxWidth: 450, width: '100%' }}
    >
      <Card.Body style={{ padding: '1.3rem' }}>
        <h3 className='text-secondary' style={{ fontSize: '0.9rem' }}>
          {title}
        </h3>
        <Container
          fluid
          className='d-flex align-items-center justify-content-between text-nowrap p-0'
        >
          <span
            className='text-warning me-2'
            style={{ fontSize: '1.8rem', lineHeight: '1' }}
            aria-hidden='true'
          >
            <i className='bi bi-fire' />
          </span>
          <h2 className='text-dark fw-bolder m-0' style={{ fontSize: '4.5rem', lineHeight: '1' }}>
            {formattedDisplayCalories}
          </h2>
          <h3 className='text-dark fw-normal m-0' style={{ fontSize: '1.2rem' }}>
            {unit}
          </h3>
        </Container>
      </Card.Body>
    </Card>
  );
};

export default CalorieDisplayCard;
