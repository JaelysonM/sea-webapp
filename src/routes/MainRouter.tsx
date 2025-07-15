import React from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {
  AnonymousAuthentication,
  AnonymousLogout,
  Loading,
  NotAuthenticated,
  NotAuthorized,
  NotFound,
} from 'pages/shared';
import { isAuthenticated, useAuthState } from 'store/auth';

import AppRouter from './AppRouter';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

const MainRouter: React.FC = () => {
  const { access_token } = useAuthState();
  const authenticated = useSelector(isAuthenticated);

  if (!authenticated && access_token) {
    return <Loading />;
  }

  return (
    <Router>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path='/authenticate' element={<AnonymousAuthentication />} />
          <Route path='/logout' element={<AnonymousLogout />} />
          <Route path='/not-found' element={<NotFound />} />
          <Route path='/not-authenticated' element={<NotAuthenticated />} />
          <Route path='/not-authorized' element={<NotAuthorized />} />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route path='/*' element={<AppRouter />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default MainRouter;
