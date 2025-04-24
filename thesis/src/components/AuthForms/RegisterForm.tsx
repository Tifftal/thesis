import { Button } from 'ui-kit/button/Button';
import { InputEmail } from 'ui-kit/inputs/InputEmail';
import { InputText } from 'ui-kit/inputs/InputText';

import { RegisterDataType } from 'pages/AuthPage/types';

type Props = {
  registerData?: RegisterDataType;
  handleChangeData: (key: string, value: string) => void;
  handleRegister: () => void;
  handleChangeTypeOfAuthForm: () => void;
};
export const RegisterForm = (props: Props) => {
  const { registerData, handleChangeData, handleRegister, handleChangeTypeOfAuthForm } = props;

  return (
    <>
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
      <InputText
        placeholder='Введите пароль'
        label='Пароль'
        type='password'
        value={registerData?.password}
        onChange={value => handleChangeData('password', value)}
      />
      {/* <InputText placeholder='Повторите пароль' type='password' value={undefined} onChange={() => {}} /> */}
      <div className='auth-page__container__actions'>
        <Button stretched onClick={handleRegister}>
          Зарегестрироваться
        </Button>
        <div className='auth-page__container__actions__no-account'>
          Уже есть аккаунт? <button onClick={handleChangeTypeOfAuthForm}>Войти</button>
        </div>
      </div>
    </>
  );
};
