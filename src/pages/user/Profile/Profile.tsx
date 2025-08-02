import React from 'react';
import { Card, Col, Container, Row, Spinner } from 'react-bootstrap';
import moment from 'moment';
import { useAuthState } from 'store/auth';

const Profile: React.FC = () => {
  const { userData } = useAuthState();

  if (!userData) {
    return (
      <div
        className='card-fade-in d-flex justify-content-center align-items-center'
        style={{ minHeight: '300px' }}
      >
        <Spinner animation='border' />
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return moment(dateString).format('DD/MM/YYYY HH:mm');
  };

  return (
    <div className='card-fade-in'>
      <div className='d-flex justify-content-between align-items-center mb-4'>
        <div>
          <h2 className='h4 fw-bold mb-1'>Meu Perfil</h2>
          <small className='text-muted'>Informações da sua conta</small>
        </div>
      </div>

      <Container fluid className='p-0'>
        <Row className='g-3'>
          <Col lg={8} xl={6}>
            <Card className='border rounded'>
              <Card.Body className='p-4'>
                <div className='d-flex align-items-start mb-4'>
                  <div
                    className='me-3 d-flex align-items-center justify-content-center'
                    style={{
                      width: '80px',
                      height: '80px',
                      background:
                        'linear-gradient(135deg, var(--bs-primary), var(--bs-primary-dark, #0b5ed7))',
                      borderRadius: '50%',
                      fontSize: '2rem',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    }}
                  >
                    <i className='bi bi-person-fill text-white'></i>
                  </div>
                  <div className='flex-grow-1'>
                    <h4 className='fw-bold mb-1 text-dark'>
                      {userData.first_name} {userData.last_name}
                    </h4>
                    <p className='text-muted mb-2'>
                      <i className='bi bi-envelope me-2'></i>
                      {userData.email}
                    </p>
                    <div className='d-flex gap-2'>
                      <span
                        className={`badge ${userData.is_active ? 'bg-success' : 'bg-danger'}`}
                        style={{ fontSize: '0.75rem' }}
                      >
                        {userData.is_active ? 'Ativo' : 'Inativo'}
                      </span>
                      {userData.is_super_user && (
                        <span className='badge bg-primary' style={{ fontSize: '0.75rem' }}>
                          Super Usuário
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <Container fluid className='p-0'>
                  <div className='row g-3'>
                    <div className='col-md-6'>
                      <div className='p-3 border rounded h-100'>
                        <div className='fw-bold text-dark mb-1'>Data de Criação</div>
                        <div className='text-muted'>{formatDate(userData.created_at)}</div>
                      </div>
                    </div>
                    <div className='col-md-6'>
                      <div className='p-3 border rounded h-100'>
                        <div className='fw-bold text-dark mb-1'>Último Login</div>
                        <div className='text-muted'>{formatDate(userData.last_login)}</div>
                      </div>
                    </div>
                    <div className='col-md-6'>
                      <div className='p-3 border rounded h-100'>
                        <div className='fw-bold text-dark mb-1'>Última Atualização</div>
                        <div className='text-muted'>{formatDate(userData.updated_at)}</div>
                      </div>
                    </div>
                    {userData.groups && userData.groups.length > 0 && (
                      <div className='col-md-6'>
                        <div className='p-3 border rounded h-100'>
                          <div className='fw-bold text-dark mb-2'>Grupos</div>
                          <div className='d-flex flex-wrap gap-1'>
                            {userData.groups.map((group, index) => (
                              <span
                                key={group.id || index}
                                className='badge bg-secondary bg-opacity-10 text-dark'
                                style={{ fontSize: '0.75rem' }}
                              >
                                {group.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Container>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Profile;
