import { CSSProperties, ReactElement } from 'react';

import cn from 'classnames';

type Props = {
  className?: string;
  type?: 'primary' | 'secondary' | 'grey' | 'red';
  size?: 's' | 'm' | 'l';
  onClick?: () => void;
  stretched?: boolean;
  style?: CSSProperties;
  children: ReactElement | string;
  disabled?: boolean;
};

export const Button = (props: Props) => {
  const {
    className,
    type = 'primary',
    size = 'l',
    onClick,
    stretched = false,
    disabled = false,
    style,
    children,
  } = props;

  return (
    <button
      type='button'
      onClick={onClick}
      className={cn(className, 'c-button', `c-button--type-${type}`, `c-button--size-${size}`, {
        'c-button--disabled': disabled,
        'c-button--stretched': stretched,
      })}
      disabled={disabled}
      style={style}>
      {children}
    </button>
  );
};
