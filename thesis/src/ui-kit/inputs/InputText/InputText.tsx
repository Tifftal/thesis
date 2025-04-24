import React, { CSSProperties, ReactElement } from 'react';

import { Input as InputTextAntd, ConfigProvider } from 'antd';
import { valueType } from 'antd/es/statistic/utils';

import { Tooltip } from 'ui-kit/tooltip';

import { InputTextChangeValueType } from 'components/types';

type Props = {
  label?: string | ReactElement;
  placeholder?: string | undefined;
  value: valueType | undefined;
  onChange: (value: string) => void;
  type?: string;
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

export const InputText = (props: Props) => {
  const {
    height = 56,
    type,
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

  if (type === 'password') {
    return (
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#74b200',
            colorPrimaryHover: '#666666',
            colorBgBase: '#FCFCFC',
            fontFamily: 'Inter Bold',
            fontSize: 15,
            controlHeight: height,
          },
        }}>
        <div className='input-text' style={{ ...style }}>
          {label && <div className='input-text__label'>{label}</div>}
          <InputTextAntd.Password
            {...props}
            style={{ width: '100%' }}
            onChange={handleChange}
            suffix={renderSuffix()}
          />
        </div>
      </ConfigProvider>
    );
  }

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
          fontFamily: 'Inter Bold',
          fontSize: 15,
          controlHeight: height,
        },
      }}>
      <div className='input-text' style={{ ...style }}>
        {label && <div className='input-text__label'>{label}</div>}
        {skeleton ? React.cloneElement(skeleton, {}, inputElement) : inputElement}
      </div>
    </ConfigProvider>
  );
};
