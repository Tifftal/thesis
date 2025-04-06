import React from 'react';

import EmptyContentIcon from 'assets/images/icons/empty.svg';

type Props = {
  description: string;
};

export const EmptyDataAlert = (props: Props) => {
  const { description } = props;

  return (
    <div className='empty-data-alert'>
      <img src={EmptyContentIcon} alt='EmptyContentIcon' />
      <div className='empty-data-alert__description'>{description}</div>
    </div>
  );
};
