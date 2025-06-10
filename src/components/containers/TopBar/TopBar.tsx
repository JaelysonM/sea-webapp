import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';

import { Logo } from 'components/elements';

interface Props {
  userName?: string | null;
  className?: string;
}

const TopBar: React.FC<Props> = ({ userName, className }) => {
  return (
    <Navbar className={`p-0 ${className || ''}`}>
      <Container className='p-0' fluid>
        <Navbar.Brand href='/'>
          <Logo />
        </Navbar.Brand>

        <Nav className='ms-auto'>
          {userName && <Navbar.Text className='text-dark fw-semibold'>Olá, {userName}</Navbar.Text>}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default TopBar;
