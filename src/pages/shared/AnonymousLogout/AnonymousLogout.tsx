import React, { useEffect, useState } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, logout } from 'store/auth';

const Logout: React.FC = () => {
  const dispatch = useDispatch();
  const authenticated = useSelector(isAuthenticated);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (authenticated) {
      dispatch(logout());
      setShowToast(true);
    }
  }, [dispatch, authenticated]);

  if (!authenticated && !showToast) {
    return <Navigate to='/' replace />;
  }

  return (
    <>
      <ToastContainer position='top-end' className='p-3'>
        <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
          <Toast.Header closeButton={false}>
            <strong className='me-auto'>Notificação</strong>
          </Toast.Header>
          <Toast.Body>Você foi desconectado com sucesso!</Toast.Body>
        </Toast>
      </ToastContainer>

      {/* Após o toast ser exibido e fechado (ou o tempo expirar), 
        o usuário será redirecionado.
      */}
      {!authenticated && <Navigate to='/' replace />}
    </>
  );
};

export default Logout;
