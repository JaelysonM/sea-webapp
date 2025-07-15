import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import { UserLayout } from 'layouts';
import { Loading, NotAuthorized, NotFound } from 'pages/shared';
import { Dashboard, Menu, Plate } from 'pages/user';
import { isAuthenticated, isUser, isUserDataLoaded } from 'store/auth';

export const UserRouter = () => {
  const authenticated = useSelector(isAuthenticated);
  const isUserRole = useSelector(isUser);
  const userDataLoaded = useSelector(isUserDataLoaded);
  if (!userDataLoaded) {
    return <Loading />;
  }

  if (authenticated && !isUserRole && userDataLoaded) {
    return <NotAuthorized />;
  }

  return (
    <Routes>
      <Route element={<UserLayout />}>
        <Route element={<Dashboard />}>
          <Route index element={<Navigate to='plate' replace />} />
          <Route path='plate' element={<Plate />} />
          <Route path='menu' element={<Menu />} />
        </Route>
        <Route path='*' element={<NotFound />} />
      </Route>
    </Routes>
  );
};
