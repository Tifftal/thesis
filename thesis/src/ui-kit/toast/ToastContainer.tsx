import {
  IconAlertTriangle,
  IconCircleCheck,
  IconExclamationCircle,
  IconInfoCircle,
  IconX,
} from '@tabler/icons-react';

import { Toast } from './types';
import './toast.css';

interface Props {
  toasts: Toast[];
  onCloseToast: (id: number) => void;
}

export const ToastContainer = (props: Props) => {
  const { toasts = [], onCloseToast } = props;

  const getColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'var(--color-green-main)';
      case 'warning':
        return 'var(--color-gold)';
      case 'error':
        return 'var(--color-red)';
      default:
        return 'var(--color-grey6)';
    }
  };

  const renderIcon = (toast: Toast) => {
    const color = getColor(toast.type);

    switch (toast.type) {
      case 'success':
        return <IconCircleCheck stroke={1.5} color={color} />;
      case 'warning':
        return <IconAlertTriangle stroke={1.5} color={color} />;
      case 'error':
        return <IconExclamationCircle stroke={1.5} color={color} />;
      default:
        return <IconInfoCircle stroke={1.5} color={color} />;
    }
  };
  return (
    <div className='toast-container'>
      {toasts.map((toast: Toast) => (
        <div key={toast?.id} className='toast' style={{ borderColor: `${getColor(toast.type)}` }}>
          <div className='toast__content'>
            <div className='toast__header'>
              <div className='toast__label'>
                {renderIcon(toast)}
                <span style={{ color: `${getColor(toast.type)}` }}>{toast?.label || 'Уведомление'}</span>
              </div>
              <IconX className='toast__close-btn' stroke={1.5} onClick={() => onCloseToast(toast?.id)} />
            </div>
            <div className='toast_description'>{toast?.message}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
