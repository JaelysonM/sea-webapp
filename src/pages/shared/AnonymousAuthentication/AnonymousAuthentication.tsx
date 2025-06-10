import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, login } from 'store/auth';

import { useQueryParams } from 'components/hooks';

const AnonymousAuthentication: React.FC = () => {
  const dispatch = useDispatch();
  const authenticated = useSelector(isAuthenticated);

  const redirectTo = '/';

  const { get } = useQueryParams();

  const redirectUrl = get.redirectUrl ? String(get.redirectUrl) : redirectTo;
  const loggedInUserId = get.userId ? Number(get.userId) : undefined;

  useEffect(() => {
    if (loggedInUserId && !authenticated) {
      dispatch(login({ userId: loggedInUserId }));
    }
  }, [authenticated, loggedInUserId, dispatch]);

  if (authenticated) {
    return <Navigate to={redirectUrl} replace />;
  }

  return <Navigate to='/' replace state={{ from: redirectUrl }} />;
};

export default AnonymousAuthentication;
