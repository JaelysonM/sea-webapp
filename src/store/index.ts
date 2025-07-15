import { useDispatch } from 'react-redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';

import auth, { persistor } from './auth';
import message from './message';
import stores from './stores';

const rootReducer = combineReducers({ auth, message, stores });

export type RootState = ReturnType<typeof rootReducer>;

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(persistor),
  devTools: process.env.NODE_ENV !== 'production',
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
