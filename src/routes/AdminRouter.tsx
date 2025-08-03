import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AdminLayout } from 'layouts';
import { Dishes, NewDish, Plates } from 'pages/admin';
import Dashboard from 'pages/admin/Dashboard/Dashboard';
import { Loading, NotAuthorized, NotFound } from 'pages/shared';
import { isAdmin, isAuthenticated, isUserDataLoaded } from 'store/auth';

export const AdminRouter = () => {
  const authenticated = useSelector(isAuthenticated);
  const isAdminRole = useSelector(isAdmin);
  const userDataLoaded = useSelector(isUserDataLoaded);

  if (!userDataLoaded) {
    return <Loading />;
  }

  if (authenticated && !isAdminRole && userDataLoaded) {
    return <NotAuthorized />;
  }

  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route element={<Dashboard />}>
          <Route index element={<Navigate to='dishes' replace />} />
          <Route path='dishes' element={<Dishes />} />
          <Route path='dishes/new' element={<NewDish />} />
          <Route path='plates' element={<Plates />} />
        </Route>
        <Route path='*' element={<NotFound />} />
      </Route>
    </Routes>
  );
};
