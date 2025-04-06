import { ReactElement } from 'react';

import { Tooltip as TooltipAntd } from 'antd';
import { TooltipPlacement } from 'antd/es/tooltip';

type Props = {
  title: string | null;
  placement?: TooltipPlacement | undefined;
  children: ReactElement | string;
};

export const Tooltip = (props: Props) => {
  const { placement = 'bottom', children } = props;
  return (
    <TooltipAntd {...props} placement={placement}>
      {children}
    </TooltipAntd>
  );
};
