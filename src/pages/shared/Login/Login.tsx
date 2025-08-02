import React, { useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch } from 'store';
import { isAuthenticated, loginWithCredentials } from 'store/auth';
import { z } from 'zod';

import { Logo } from 'components/elements';

const loginSchema = z.object({
  email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginError {
  detail?: string;
  non_field_errors?: string[];
  email?: string[];
  password?: string[];
}

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const authenticated = useSelector(isAuthenticated);
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    // Limpar erro quando component monta
    setLoginError('');
  }, []);

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setLoginError('');

    try {
      const result = await dispatch(loginWithCredentials(data));

      if (loginWithCredentials.rejected.match(result)) {
        // Tratamento de diferentes tipos de erro
        const error = result.payload as LoginError;
        console.log('Login error:', error);

        if (error?.detail) {
          setLoginError(error.detail);
        } else if (error?.non_field_errors) {
          setLoginError(error.non_field_errors[0]);
        } else if (error?.email) {
          setLoginError(`Email: ${error.email[0]}`);
        } else if (error?.password) {
          setLoginError(`Senha: ${error.password[0]}`);
        } else {
          setLoginError('Credenciais inválidas. Verifique seu email e senha.');
        }
      } else if (loginWithCredentials.fulfilled.match(result)) {
        // Login bem-sucedido, não fazemos nada aqui pois o estado já foi atualizado
        console.log('Login successful');
      }
    } catch (error) {
      console.error('Login exception:', error);
      setLoginError('Erro interno do servidor. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  if (authenticated) {
    const fromPath = (location.state as { from?: Location })?.from?.pathname || '/';
    return <Navigate to={fromPath} replace />;
  }

  return (
    <div className='min-vh-100 d-flex flex-column'>
      {/* Conteúdo principal centralizado */}
      <div className='flex-grow-1 d-flex align-items-center justify-content-center'>
        <Container>
          <Row className='justify-content-center'>
            <Col xs={12} sm={8} md={6} lg={4} xl={3}>
              <Card className='border'>
                <Card.Body className='p-4'>
                  <div className='text-center mb-4'>
                    <div className='mb-3 d-flex justify-content-center'>
                      <Logo />
                    </div>
                    <p className='text-muted small mb-0'>Faça login para continuar</p>
                  </div>
                  <Form onSubmit={handleSubmit(onSubmit)}>
                    {loginError && (
                      <Alert variant='danger' className='py-2 px-3 small'>
                        {loginError}
                      </Alert>
                    )}

                    <Form.Group className='mb-3'>
                      <Form.Label className='small fw-semibold text-dark'>Email</Form.Label>
                      <Form.Control
                        type='email'
                        placeholder='Digite seu email'
                        {...register('email')}
                        isInvalid={!!errors.email}
                        disabled={isLoading}
                        className='py-2'
                      />
                      <Form.Control.Feedback type='invalid' className='small'>
                        {errors.email?.message}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className='mb-4'>
                      <Form.Label className='small fw-semibold text-dark'>Senha</Form.Label>
                      <Form.Control
                        type='password'
                        placeholder='Digite sua senha'
                        {...register('password')}
                        isInvalid={!!errors.password}
                        disabled={isLoading}
                        className='py-2'
                      />
                      <Form.Control.Feedback type='invalid' className='small'>
                        {errors.password?.message}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Button
                      type='submit'
                      variant='primary'
                      className='w-100 py-2 fw-semibold'
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Spinner
                            as='span'
                            animation='border'
                            size='sm'
                            role='status'
                            aria-hidden='true'
                            className='me-2'
                          />
                          Entrando...
                        </>
                      ) : (
                        'Entrar'
                      )}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Footer fixo na parte inferior */}
      <div className='text-center py-3'>
        <p className='text-muted small mb-1'>v0.1.0</p>
        <p className='text-muted small mb-0'>Feito com ❤️ no IFCE Fortaleza</p>
      </div>
    </div>
  );
};

export default Login;
