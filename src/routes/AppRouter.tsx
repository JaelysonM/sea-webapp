import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Loading, NotFound } from 'pages/shared';
import { isAdmin, isUserDataLoaded } from 'store/auth';

import { AdminRouter } from './AdminRouter';
import { UserRouter } from './UserRouter';

const AppRouter = () => {
  const userIsAdmin = useSelector(isAdmin);
  const userDataLoaded = useSelector(isUserDataLoaded);

  if (!userDataLoaded) {
    return <Loading />;
  }

  return (
    <Routes>
      <Route path='/user/*' Component={UserRouter} />
      <Route path='/admin/*' Component={AdminRouter} />
      <Route path='/' element={<Navigate to={userIsAdmin ? '/admin' : '/user'} replace />} />
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;
