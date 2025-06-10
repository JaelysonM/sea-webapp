import { useSelector } from 'react-redux';
import { createAction, createReducer } from '@reduxjs/toolkit';
import { RootState } from 'store';

export type State = {
  messages: Message[];
};

export type Message = {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  position: 'top' | 'bottom';
  duration?: number;
  text: string;
  hidden?: boolean;
  onClose?: () => void;
  onTimeout?: () => void;
};

const selector = (state: RootState) => state.message;
export const useMessageState = () => useSelector(selector);

export const addMessage = createAction<Message>('ADD_MESSAGE');
export const removeMessage = createAction<string>('REMOVE_MESSAGE');
export const clearMessages = createAction<{
  disappear?: boolean;
}>('CLEAR_MESSAGES');

export const hideMessage = createAction<string>('HIDE_MESSAGE');

export default createReducer<State>({ messages: [] }, (builder) => {
  builder
    .addCase(addMessage, (state, action) => {
      state.messages.push(action.payload);
    })
    .addCase(removeMessage, (state, action) => {
      state.messages = state.messages.filter((m) => m.id !== action.payload);
    })
    .addCase(hideMessage, (state, action) => {
      const message = state.messages.find((m) => m.id === action.payload);
      if (message) {
        message.hidden = true;
      }
    })
    .addCase(clearMessages, (state, action) => {
      if (action.payload.disappear) {
        state.messages = [
          ...state.messages.map((m) => {
            m.hidden = true;
            m.duration = 0;
            return m;
          }),
        ];
      } else {
        state.messages = [];
      }
    });
});
