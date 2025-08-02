import React from 'react';
import { Alert, Button, Col, Container, Row } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';

const NotAuthenticated: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const fromPath = (location.state as { from?: Location })?.from?.pathname || '/';

  const handleLoginClick = () => {
    navigate('/login', { state: { from: location.state?.from } });
  };

  return (
    <Container className='mt-5 text-center' data-testid='not-authenticated-page'>
      <Row className='justify-content-center'>
        <Col md={8} lg={6}>
          <Alert variant='warning' className='shadow-sm'>
            <Alert.Heading as='h2'>Acesso Restrito</Alert.Heading>
            <p>
              Você precisa estar autenticado para acessar este conteúdo. Por favor, faça login para
              continuar.
            </p>
            {location.state?.from && (
              <p className='mb-0 fst-italic small'>
                Após o login, tentaremos redirecioná-lo para: {fromPath}
              </p>
            )}
            <div className='mt-3'>
              <Button variant='primary' onClick={handleLoginClick} className='me-2'>
                Fazer Login
              </Button>
            </div>
          </Alert>
        </Col>
      </Row>
    </Container>
  );
};

export default NotAuthenticated;
