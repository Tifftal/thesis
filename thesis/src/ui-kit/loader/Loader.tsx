import React, { CSSProperties } from 'react';

import { CircularProgress } from '@mui/material';
import cn from 'classnames';

type Props = {
  title?: string;
  size: number;
  isMini?: boolean;
  isBackground?: boolean;
  style?: CSSProperties;
};

export const Loader = (props: Props) => {
  const { title, size, isMini, isBackground, style } = props;

  const renderLoader = () => <CircularProgress size={size} />;

  if (isMini) {
    return (
      <span className='loader-mini' style={style}>
        {renderLoader()}
      </span>
    );
  }

  return (
    <div
      className={cn('loader', {
        'loader-with-background': isBackground,
      })}
      style={style}>
      <div className='loader-inner'>
        <div className='loader__content'>
          {renderLoader()}
          {title && <p className='loader-inner__title'>{title}</p>}
        </div>
      </div>
    </div>
  );
};
