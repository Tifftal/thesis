import { CSSProperties, ReactElement, useState } from 'react';

import { Input as InputTextAntd, ConfigProvider } from 'antd';
import { valueType } from 'antd/es/statistic/utils';

import { InputTextChangeValueType } from 'components/types';

import { getEmailValidationError } from './helpers';

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
  error?: string | undefined;
  onValidationChange?: (error: string) => void;
};

export const InputEmail = (props: Props) => {
  const {
    height = 56,
    status,
    style = {
      width: '100%',
    },
    label,
    onChange,
    disabled = false,
    error,
    onValidationChange,
    ...restProps
  } = props;

  const [validationError, setValidationError] = useState<string>('');

  const handleChange = (e: InputTextChangeValueType) => {
    if (disabled) return;

    const newValue = e?.target?.value || '';
    const errorMessage = newValue.length > 0 && getEmailValidationError(newValue);

    setValidationError(errorMessage || '');
    onValidationChange?.(errorMessage || '');
    onChange(e.target.value);
  };

  const renderSuffix = () => {
    if (disabled) return <i className='licard-icon licard-icon-lock' />;
    return null;
  };

  const resolvedStatus = error || validationError ? 'error' : status;

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
      <div className='input-email' style={{ ...style }}>
        {label && <div className='input-email__label'>{label}</div>}
        <InputTextAntd
          {...restProps}
          status={resolvedStatus}
          style={{ ...style }}
          onChange={handleChange}
          suffix={renderSuffix()}
        />
        {(error || validationError) && <div className='input-email__error'>{error || validationError}</div>}
      </div>
    </ConfigProvider>
  );
};
