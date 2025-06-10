import React from 'react';

interface Props {
  weight: number;
  price: number;
  className?: string;
  style?: React.CSSProperties;
}

const DisplayBalance: React.FC<Props> = ({ weight, price, className = '', style }) => {
  const formattedWeight = weight.toLocaleString('en-US', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });

  const formattedPrice = price.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div
      className={`d-inline-flex align-items-center justify-content-between p-2  rounded bg-white ${className} shadow-sm`}
      style={{ minWidth: '260px', fontFamily: 'system-ui, sans-serif', ...style }}
    >
      <div className='d-flex align-items-center'>
        <span
          className='text-primary'
          style={{ fontSize: '1.5rem', lineHeight: '1' }}
          aria-hidden='true'
        >
          <i className='bi bi-speedometer2' />
        </span>
        <div className='d-flex align-items-baseline ms-2'>
          <h5 className='fw-bold m-0' style={{ fontSize: '1.25rem' }}>
            {formattedWeight}
          </h5>
          <span className='ms-1 text-secondary' style={{ fontSize: '0.9rem' }}>
            kg
          </span>
        </div>
      </div>

      <div className='d-flex align-items-center'>
        <span
          className='text-success'
          style={{ fontSize: '1.5rem', lineHeight: '1' }}
          aria-hidden='true'
        >
          <i className='bi bi-cash' />
        </span>
        <div className='d-flex align-items-baseline ms-2'>
          <h5 className='fw-bold m-0' style={{ fontSize: '1.25rem' }}>
            {formattedPrice}
          </h5>
          <span className='ms-1 text-secondary' style={{ fontSize: '0.9rem' }}>
            R$
          </span>
        </div>
      </div>
    </div>
  );
};

export default DisplayBalance;
