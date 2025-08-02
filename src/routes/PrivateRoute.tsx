/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Loading } from 'pages/shared';
import { useAppDispatch } from 'store';
import { fetchUserData, isAuthenticated, useAuthState } from 'store/auth';

import { useFirstRender } from 'components/hooks';

const PrivateRoute = ({ ...rest }) => {
  const { access_token } = useAuthState();
  const authenticated = useSelector(isAuthenticated);
  const firstRender = useFirstRender();
  const dispatch = useAppDispatch();
  const location = useLocation();

  useEffect(() => {
    if (authenticated && access_token) {
      dispatch(fetchUserData());
    }
  }, [dispatch, authenticated, access_token]);

  if (!authenticated && access_token && firstRender) {
    return <Loading />;
  }

  if (!authenticated && !access_token) {
    return <Navigate to='/login' replace state={{ from: location }} />;
  }

  if (access_token && !authenticated) {
    return <Loading />;
  }

  return <Outlet {...rest} />;
};

export default PrivateRoute;
