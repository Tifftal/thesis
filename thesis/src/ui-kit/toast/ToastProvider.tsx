import { ReactNode, useState } from 'react';

import { Toast } from './types';

import { ToastContainer } from './ToastContainer';
import { ToastContext } from './ToastContext';

type Props = {
  children: ReactNode;
};

export const ToastProvider = (props: Props) => {
  const { children } = props;

  const [toasts, setToasts] = useState<Toast[]>([]);

  const handleCloseToast = (id: number) => {
    const newToast = toasts.filter(toast => toast?.id !== id);

    setToasts(newToast);
  };

  const onMessage = (message: string, type: string, label?: string) => {
    const initMessageId = () => {
      if (!toasts?.length) return 1;

      const lastToast = toasts[toasts.length - 1];

      const newMessageId = lastToast?.id + 1;

      return newMessageId;
    };

    const newToasts = [...toasts];
    const newMessage = {
      id: initMessageId(),
      message,
      type,
      label,
    };
    newToasts.push(newMessage);
    setToasts(newToasts);
    setTimeout(() => {
      handleCloseToast(newMessage?.id);
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ onMessage }}>
      {children}
      <ToastContainer toasts={toasts} onCloseToast={handleCloseToast} />
    </ToastContext.Provider>
  );
};
