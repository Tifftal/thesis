import { CSSProperties, ReactElement } from 'react';

import cn from 'classnames';

import { Tooltip } from 'ui-kit/tooltip';

type Props = {
  className?: string;
  type?: 'primary' | 'secondary';
  onClick?: () => void;
  style?: CSSProperties;
  icon: ReactElement;
  disabled?: boolean;
  tooltip?: string;
};

export const IconButton = (props: Props) => {
  const { className, type = 'primary', onClick, disabled = false, style, icon, tooltip = '' } = props;

  const buttonElement = (
    <button
      onClick={onClick}
      className={cn(className, 'icon-button', `icon-button--type-${type}`, {
        'icon-button--disabled': disabled,
      })}
      disabled={disabled}
      style={style}>
      {icon}
    </button>
  );

  const tooltipElement = <Tooltip title={tooltip}>{buttonElement}</Tooltip>;

  return <>{tooltip ? tooltipElement : buttonElement}</>;
};
