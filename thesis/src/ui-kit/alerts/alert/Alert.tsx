import React, { useState } from 'react';

type Props = {
  description: string;
};

export const Alert = (props: Props) => {
  const { description } = props;

  const [isVisible, setVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className='alert'>
      <div className='alert__content'>
        <div className='alert_icon'>
          <i className='licard-icon licard-icon-info' />
        </div>
        <div className='alert_description'>{description}</div>
        <div className='alert_actions'>
          <i className='licard-icon licard-icon-cross' onClick={() => setVisible(false)} />
        </div>
      </div>
    </div>
  );
};
