import React, { ReactElement } from 'react';

import { ConfigProvider, Skeleton as SkeletonAntd } from 'antd';
import cn from 'classnames';

type Props = {
  loading?: boolean;
  paragraph?: boolean;
  round?: boolean;
  children?: ReactElement;
  width?: number | string;
  rows?: number;
  height?: number;
  className?: string;
  borderRadius?: number;
};

export const Skeleton = (props: Props) => {
  const { width = 100, children, rows = 1, height = 20, className, borderRadius = 8 } = props;

  const skeletonClassName = cn('skeleton', className);

  return (
    <ConfigProvider
      theme={{
        components: {
          Skeleton: {
            paragraphLiHeight: height,
            titleHeight: height,
            blockRadius: borderRadius,
          },
        },
      }}>
      <SkeletonAntd
        {...props}
        paragraph={{ rows: rows, width: width }}
        title={false}
        active={true}
        className={skeletonClassName}>
        {children}
      </SkeletonAntd>
    </ConfigProvider>
  );
};
