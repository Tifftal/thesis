import React, { CSSProperties, ReactElement } from 'react';

import { Input as InputTextAntd, ConfigProvider } from 'antd';

import { Tooltip } from 'ui-kit/tooltip';

import { InputTextChangeValueType } from 'components/types';

type Props = {
  label?: string | ReactElement;
  placeholder?: string | undefined;
  value: string | undefined;
  onChange: (value: string) => void;
  status?: 'warning' | 'error' | undefined;
  height?: number;
  isOutlined?: boolean;
  style?: CSSProperties;
  disabled?: boolean;
  maxLength?: number;
  showCount?: boolean;
  suffix?: ReactElement;
  skeleton?: ReactElement;
};

export const InputNote = (props: Props) => {
  const {
    height = 28,
    style = { width: '100%' },
    label,
    onChange,
    disabled = false,
    suffix,
    skeleton,
  } = props;

  const handleChange = (e: InputTextChangeValueType) => {
    if (!disabled) {
      onChange(e.target.value);
    }
  };

  const renderSuffix = () => {
    if (disabled) {
      return (
        <Tooltip title='Только для чтения' placement='topLeft'>
          <i className='licard-icon licard-icon-lock' />
        </Tooltip>
      );
    }

    if (suffix) return suffix;

    return null;
  };

  const inputElement = (
    <InputTextAntd {...props} style={{ width: '100%' }} onChange={handleChange} suffix={renderSuffix()} />
  );

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#74b200',
          colorPrimaryHover: '#666666',
          colorBgBase: '#FCFCFC',
          fontFamily: 'Inter Regular',
          fontSize: 12,
          controlHeight: height,
        },
      }}>
      <div className='input-note' style={{ ...style }}>
        {label && <div className='input-note__label'>{label}</div>}
        {skeleton ? React.cloneElement(skeleton, {}, inputElement) : inputElement}
      </div>
    </ConfigProvider>
  );
};
