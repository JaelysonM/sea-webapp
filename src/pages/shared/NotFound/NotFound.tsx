import React from 'react';
import { Alert, Col, Container, Row } from 'react-bootstrap';

const NotFound: React.FC = () => {
  return (
    <Container className='mt-5 text-center' data-testid='not-found-page'>
      <Row>
        <Col>
          <Alert variant='danger' className='shadow-sm'>
            <Alert.Heading as='h2'>Oops! Página Não Encontrada</Alert.Heading>
            <p className='mb-0'>
              Lamentamos, mas a página que você está tentando acessar não existe, foi removida, teve
              o nome alterado ou está temporariamente indisponível.
            </p>
          </Alert>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound;
