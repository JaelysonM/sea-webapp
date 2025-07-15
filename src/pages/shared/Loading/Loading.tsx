import React from 'react';
import { Spinner } from 'react-bootstrap';

const Loading = () => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        zIndex: 9999,
      }}
    >
      <Spinner
        animation='border'
        role='status'
        style={{
          width: '3rem',
          height: '3rem',
          color: 'var(--bs-primary)',
        }}
      >
        <span className='visually-hidden'>Loading...</span>
      </Spinner>
    </div>
  );
};

export default Loading;
