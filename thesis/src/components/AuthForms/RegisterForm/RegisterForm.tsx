import { useState } from 'react';

import cn from 'classnames';

import { Button } from 'ui-kit/button/Button';
import { InputEmail } from 'ui-kit/inputs/InputEmail';
import { InputText } from 'ui-kit/inputs/InputText';

import { getErrorConfirmedPassword, isValidRegisterData, validatePassword } from '../validation';

import { RegisterDataType } from 'pages/AuthPage/types';

import { ValidationIcon } from './ValidationIcon';

import './register-form.css';

type Props = {
  registerData?: RegisterDataType;
  handleChangeData: (key: string, value: string) => void;
  handleRegister: () => void;
  handleChangeTypeOfAuthForm: () => void;
};
export const RegisterForm = (props: Props) => {
  const { registerData, handleChangeData, handleRegister, handleChangeTypeOfAuthForm } = props;

  const { rules: validationRules, isValid } = validatePassword(registerData?.password || '');

  const [confirmedPassword, setConfirmedPassword] = useState<string>('');

  return (
    <>
      <div className='register-form__container'>
        <div className='register-form__container__content'>
          <InputText
            placeholder='Иванов'
            label='Фамилия'
            value={registerData?.lastName}
            onChange={value => handleChangeData('lastName', value)}
          />
          <InputText
            placeholder='Иван'
            label='Имя'
            value={registerData?.firstName}
            onChange={value => handleChangeData('firstName', value)}
          />
          <InputText
            placeholder='Иванович'
            label='Отчество'
            value={registerData?.patronymic}
            onChange={value => handleChangeData('patronymic', value)}
          />
          <InputEmail
            label='Электронная почта'
            placeholder='Введите электронную почту'
            value={registerData?.username}
            onChange={value => handleChangeData('username', value)}
          />
        </div>
        <div className='register-form__container__content'>
          <InputText
            placeholder='Введите пароль'
            label='Пароль'
            type='password'
            value={registerData?.password}
            onChange={value => handleChangeData('password', value)}
          />
          <div className='create-new-password__hints-list'>
            {validationRules.map(({ key, label, subLabel, isValid }) => (
              <div
                key={key}
                className={cn('create-new-password__hint-item', {
                  'create-new-password__hint-item-sublabel': subLabel,
                })}>
                <ValidationIcon isValid={isValid} />
                <div className='create-new-password__hint_text'>
                  <span>{label}</span>
                  {subLabel && <i className='create-new-password__sublabel'>{subLabel}</i>}
                </div>
              </div>
            ))}
          </div>
          <InputText
            placeholder='Повторите пароль'
            type='password'
            value={confirmedPassword}
            onChange={value => setConfirmedPassword(value)}
            status={
              getErrorConfirmedPassword(registerData?.password || '', confirmedPassword) ? undefined : 'error'
            }
          />
        </div>
      </div>
      <div className='auth-page__container__actions'>
        <Button
          stretched
          onClick={handleRegister}
          disabled={!isValidRegisterData(registerData, confirmedPassword) || !isValid}>
          Зарегистрироваться
        </Button>
        <div className='auth-page__container__actions__no-account'>
          Уже есть аккаунт? <button onClick={handleChangeTypeOfAuthForm}>Войти</button>
        </div>
      </div>
    </>
  );
};
