import React from 'react';
import { Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';

import { TopBar } from 'components/containers';

const AdminLayout: React.FC = () => {
  return (
    <Container className='d-flex flex-column min-vh-100 p-4 flex-grow-1 m-0' fluid>
      <TopBar header='Painel Admin' homePath='/admin' />
      <Container fluid className='p-0 flex-grow-1 mt-4'>
        <Outlet />
      </Container>
    </Container>
  );
};

export default AdminLayout;
