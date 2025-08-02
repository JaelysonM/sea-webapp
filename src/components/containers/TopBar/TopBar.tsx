import React from 'react';
import { Button, Container, Nav, Navbar, OverlayTrigger, Popover } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { Logo } from 'components/elements';

interface Props {
  userName?: string | null;
  className?: string;
  header?: string;
  homePath?: string;
}

const TopBar: React.FC<Props> = ({ userName, className, header, homePath }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/logout');
  };

  const handleProfile = () => {
    navigate('/user/profile');
  };

  const isAdmin = homePath === '/admin';

  const userPopover = (
    <Popover id='user-popover' style={{ borderRadius: '0.60rem' }}>
      <Popover.Body className='p-2'>
        <div className='d-grid gap-1'>
          {!isAdmin && (
            <Button
              size='sm'
              onClick={handleProfile}
              className='text-start py-2'
              style={{
                border: 'none',
                borderRadius: '0.375rem',
                backgroundColor: 'transparent',
                color: 'inherit',
              }}
            >
              Perfil
            </Button>
          )}
          <Button
            size='sm'
            onClick={handleLogout}
            className='text-start py-2 text-danger'
            style={{
              border: 'none',
              borderRadius: '0.375rem',
              backgroundColor: 'transparent',
            }}
          >
            Logout
          </Button>
        </div>
      </Popover.Body>
    </Popover>
  );

  return (
    <Navbar className={`p-0 ${className || ''}`}>
      <Container className='p-0' fluid>
        <Navbar.Brand href={homePath}>
          <Logo />
        </Navbar.Brand>

        <Nav className='ms-auto d-flex align-items-center gap-3'>
          {header ? <Navbar.Text className='text-dark fw-semibold'>{header}</Navbar.Text> : null}

          {userName ? (
            <OverlayTrigger trigger='click' placement='bottom-end' overlay={userPopover} rootClose>
              <Navbar.Text
                className='text-dark fw-semibold'
                style={{ cursor: 'pointer', userSelect: 'none' }}
              >
                Olá, {userName}
              </Navbar.Text>
            </OverlayTrigger>
          ) : null}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default TopBar;
