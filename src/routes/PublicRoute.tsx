import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { Loading } from 'pages/shared';
import { isAuthenticated, useAuthState } from 'store/auth';

const PublicRoute = ({ ...rest }) => {
  const { access_token } = useAuthState();
  const authenticated = useSelector(isAuthenticated);

  if (!authenticated && access_token) {
    return <Loading />;
  }

  return <Outlet {...rest} />;
};

export default PublicRoute;
