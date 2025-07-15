import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';

import { Logo } from 'components/elements';

interface Props {
  userName?: string | null;
  className?: string;
  header?: string;
  homePath?: string;
}

const TopBar: React.FC<Props> = ({ userName, className, header, homePath }) => {
  return (
    <Navbar className={`p-0 ${className || ''}`}>
      <Container className='p-0' fluid>
        <Navbar.Brand href={homePath}>
          <Logo />
        </Navbar.Brand>

        <Nav className='ms-auto'>
          {userName && <Navbar.Text className='text-dark fw-semibold'>Olá, {userName}</Navbar.Text>}
          {header ? <Navbar.Text className='text-dark fw-semibold'>{header}</Navbar.Text> : null}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default TopBar;
