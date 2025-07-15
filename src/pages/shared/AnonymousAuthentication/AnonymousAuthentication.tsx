import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { Loading } from 'pages/shared';
import { useAppDispatch } from 'store';
import { isAuthenticated, login } from 'store/auth';

import { useQueryParams } from 'components/hooks';

const AnonymousAuthentication: React.FC = () => {
  const dispatch = useAppDispatch();
  const authenticated = useSelector(isAuthenticated);

  const { get } = useQueryParams();

  const loggedInToken = get.token ? String(get.token) : '';

  useEffect(() => {
    if (loggedInToken && !authenticated) {
      dispatch(
        login({
          token: loggedInToken,
        }),
      );
    }
  }, [authenticated, loggedInToken, dispatch]);

  if (!authenticated) {
    return <Loading />;
  }

  return <Navigate to='/' replace />;
};

export default AnonymousAuthentication;
