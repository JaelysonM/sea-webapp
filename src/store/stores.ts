import { useDispatch, useSelector } from 'react-redux';
import { createAction, createReducer } from '@reduxjs/toolkit';
import { Store } from '@types';
import { RootState } from 'store';

type State = {
  store: Store | null;
};

export const useSetStore = () => {
  const dispatch = useDispatch();
  return (store: Store) => dispatch(setStore(store));
};

export const useUpdateStore = () => {
  const dispatch = useDispatch();
  return (updates: Partial<Store>) => dispatch(updateStore(updates));
};

export const useResetStore = () => {
  const dispatch = useDispatch();
  return () => dispatch(resetStore());
};

const selector = (state: RootState) => state.stores;
export const useStoreState = () => useSelector(selector).store;

export const setStore = createAction<Store>('SET_STORE');
export const updateStore = createAction<Partial<Store>>('UPDATE_STORE');
export const resetStore = createAction('RESET_STORE');

export default createReducer<State>({ store: null }, (builder) => {
  builder
    .addCase(setStore, (state, action) => {
      state.store = action.payload;
    })
    .addCase(updateStore, (state, action) => {
      if (state.store) {
        state.store = { ...state.store, ...action.payload };
      }
    })
    .addCase(resetStore, (state) => {
      state.store = null;
    });
});
