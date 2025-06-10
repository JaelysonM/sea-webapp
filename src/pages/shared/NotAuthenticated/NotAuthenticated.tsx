import React from 'react';
import { Alert, Col, Container, Row } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';

const NotAuthenticated: React.FC = () => {
  const location = useLocation();

  const fromPath = (location.state as { from?: Location })?.from?.pathname || '/';

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
          </Alert>
        </Col>
      </Row>
    </Container>
  );
};

export default NotAuthenticated;
