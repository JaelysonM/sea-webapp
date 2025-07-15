import React from 'react';
import { Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import { useAuthState } from 'store/auth';

import { TopBar } from 'components/containers';

const UserLayout: React.FC = () => {
  const { userData } = useAuthState();

  return (
    <Container className='d-flex flex-column min-vh-100 p-4 flex-grow-1 m-0' fluid>
      <TopBar userName={userData?.first_name} homePath='/user' />
      <Container fluid className='p-0 flex-grow-1 mt-4' style={{ paddingBottom: '2rem' }}>
        <Outlet />
      </Container>
    </Container>
  );
};

export default UserLayout;
