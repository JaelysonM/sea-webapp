import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { UserLayout } from 'layouts';
import { NotFound } from 'pages/shared';
import { Dashboard, Menu, Plate } from 'pages/user';

export const UserRouter: React.FC = () => {
  return (
    <Routes>
      <Route path='*' element={<UserLayout />}>
        <Route path='user/' element={<Dashboard />}>
          <Route index element={<Navigate to='plate' replace />} />
          <Route path='plate' element={<Plate />} />
          <Route path='menu' element={<Menu />} />
        </Route>
        <Route path='*' element={<NotFound />} />
      </Route>
    </Routes>
  );
};
