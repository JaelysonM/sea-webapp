import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { Loading } from 'pages/shared';
import { toast } from 'sonner';
import { useAppDispatch } from 'store';
import { isAuthenticated, login } from 'store/auth';

import { useQueryParams } from 'components/hooks';

const AnonymousAuthentication: React.FC = () => {
  const dispatch = useAppDispatch();
  const authenticated = useSelector(isAuthenticated);

  const { get } = useQueryParams();

  const navigate = useNavigate();

  const loggedInToken = get.token ? String(get.token) : '';

  useEffect(() => {
    if (loggedInToken && !authenticated) {
      console.log('Attempting to log in with token:', loggedInToken);
      dispatch(
        login({
          token: loggedInToken,
        }),
      ).then((result) => {
        if (login.rejected.match(result)) {
          navigate('/login', {
            replace: true,
            state: { from: '/authenticate' },
          });
          toast.error('Login falhou. Verifique suas credenciais.', {
            duration: 5000,
          });
        }
      });
    }
  }, [authenticated, loggedInToken, dispatch, navigate]);

  if (!authenticated) {
    return <Loading />;
  }

  return <Navigate to='/' replace />;
};

export default AnonymousAuthentication;
