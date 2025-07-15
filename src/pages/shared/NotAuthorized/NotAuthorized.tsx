import React from 'react';
import { Alert, Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const NotAuthorized: React.FC = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <Container className='d-flex justify-content-center align-items-center min-vh-100'>
      <div className='text-center' style={{ maxWidth: '500px' }}>
        <div className='mb-4'>
          <i className='bi bi-shield-exclamation text-warning' style={{ fontSize: '4rem' }}></i>
        </div>

        <Alert variant='warning'>
          <Alert.Heading>Acesso Negado</Alert.Heading>
          <p className='mb-3'>Você não tem permissão para acessar esta área do sistema.</p>
          <p className='mb-0'>
            Entre em contato com o administrador se você acredita que deveria ter acesso.
          </p>
        </Alert>

        <div className='d-flex gap-2 justify-content-center flex-wrap'>
          <Button variant='outline-secondary' onClick={handleGoBack}>
            <i className='bi bi-arrow-left me-2'></i>
            Voltar
          </Button>
          <Button variant='primary' onClick={handleGoHome}>
            <i className='bi bi-house me-2'></i>
            Página Inicial
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default NotAuthorized;
