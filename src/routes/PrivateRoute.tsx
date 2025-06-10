/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { Loading } from 'pages/shared';
import { useAppDispatch } from 'store';
import { fetchUserData, isAuthenticated, useAuthState } from 'store/auth';

import { useFirstRender } from 'components/hooks';

const PrivateRoute = ({ ...rest }) => {
  const { userId } = useAuthState();
  const authenticated = useSelector(isAuthenticated);
  const firstRender = useFirstRender();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  if (!authenticated && userId && firstRender) {
    return <Loading />;
  }

  if (!authenticated || !userId) {
    return <Navigate to='/not-authenticated' replace state={{ from: rest.location }} />;
  }

  return <Outlet {...rest} />;
};

export default PrivateRoute;
