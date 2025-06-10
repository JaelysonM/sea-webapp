import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { Loading } from 'pages/shared';
import { isAuthenticated, useAuthState } from 'store/auth';

const PublicRoute = ({ ...rest }) => {
  const { userId } = useAuthState();
  const authenticated = useSelector(isAuthenticated);

  if (!authenticated && userId) {
    return <Loading />;
  }

  return <Outlet {...rest} />;
};

export default PublicRoute;
