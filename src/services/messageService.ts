import store from 'store';
import { addMessage, clearMessages, hideMessage, Message, removeMessage } from 'store/message';

type MessageOptions = {
  duration?: number;
  position?: Message['position'];
  onTimeout?: () => void;
  onClose?: () => void;
};

const showMessage = (
  type: Message['type'],
  text: string,
  options: MessageOptions = { position: 'top' },
): string => {
  const id = Math.random().toString(36).substring(7);
  const { duration, position = 'top', onTimeout, onClose } = options;
  store.dispatch(
    addMessage({
      id,
      text,
      type,
      position,
      duration,
      onTimeout,
      onClose,
    }),
  );

  return id;
};

export const remove = (id: string) => {
  store.dispatch(removeMessage(id));
};

export const hide = (id: string) => {
  store.dispatch(hideMessage(id));
};

export const clear = (disappear?: boolean) => {
  store.dispatch(clearMessages({ disappear }));
};

const info = (text: string, options?: MessageOptions): string => {
  return showMessage('info', text, options);
};

const warning = (text: string, options?: MessageOptions): string => {
  return showMessage('warning', text, options);
};

const success = (text: string, options?: MessageOptions): string => {
  return showMessage('success', text, options);
};

const error = (text: string, options?: MessageOptions): string => {
  return showMessage('error', text, options);
};

export default {
  info,
  warning,
  success,
  error,
  remove,
  hide,
  clear,
} as const;
