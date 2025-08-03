import React, { useEffect, useState } from 'react';
import { Container, Spinner } from 'react-bootstrap';

const ProcessingLoader: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [fadeIn, setFadeIn] = useState(false);

  const steps = [
    { label: 'Identificando alimentos', icon: 'bi-search' },
    { label: 'Calculando nutrientes', icon: 'bi-calculator' },
    { label: 'Finalizando dados', icon: 'bi-check-circle' },
  ];

  useEffect(() => {
    setFadeIn(true);

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 800);

    return () => clearInterval(stepInterval);
  }, [steps.length]);

  return (
    <Container
      className={`p-0 d-flex flex-column align-items-center justify-content-center ${
        fadeIn ? 'fade-in' : ''
      }`}
      style={{
        minHeight: '400px',
        transition: 'opacity 0.3s ease-in-out',
        opacity: fadeIn ? 1 : 0,
      }}
    >
      <div className='text-center'>
        <div className='mb-4'>
          <div
            className='d-inline-flex align-items-center justify-content-center rounded-circle bg-success bg-opacity-10 mb-3'
            style={{ width: '80px', height: '80px' }}
          >
            <i className='bi bi-check-circle text-success' style={{ fontSize: '2.5rem' }}></i>
          </div>
          <h4 className='fw-bold text-dark mb-3'>Prato identificado com sucesso!</h4>
          <p className='text-muted mb-4'>
            Identificamos seu prato com sucesso. Agora estamos processando as informações
            nutricionais...
          </p>
        </div>

        <div className='d-flex align-items-center justify-content-center mb-4'>
          <Spinner animation='border' variant='success' className='me-3' />
          <span className='text-success fw-semibold'>Processando dados do prato...</span>
        </div>

        <div className='bg-light rounded-3 p-3' style={{ maxWidth: '300px' }}>
          {steps.map((step, index) => (
            <div key={index} className='d-flex justify-content-between align-items-center mb-2'>
              <small className='text-muted'>{step.label}</small>
              {index < currentStep ? (
                <i className='bi bi-check-circle-fill text-success'></i>
              ) : index === currentStep ? (
                <Spinner animation='border' size='sm' variant='success' />
              ) : (
                <i className='bi bi-circle text-muted'></i>
              )}
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
};

export default ProcessingLoader;
