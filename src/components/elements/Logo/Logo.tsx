import React from 'react';

interface Props {
  className?: string;
}

const Logo: React.FC<Props> = ({ className }) => {
  return (
    <div className={`d-inline-flex flex-row align-items-center ${className || ''}`}>
      <span className='text-warning fw-bold fs-1 lh-1 me-2'>SEA</span>
      <span className='text-dark fw-light fs-6' style={{ letterSpacing: '0.05em' }}>
        Smart <span className='text-decoration-underline'>Eating</span>
      </span>
    </div>
  );
};

export default Logo;
