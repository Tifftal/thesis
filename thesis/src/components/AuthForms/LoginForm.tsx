import { Button } from 'ui-kit/button/Button';
import { InputEmail } from 'ui-kit/inputs/InputEmail';
import { InputText } from 'ui-kit/inputs/InputText';

import { LoginDataType } from 'pages/AuthPage/types';

type Props = {
  loginData?: LoginDataType;
  handleChangeData: (key: string, value: string) => void;
  handleLogin: () => void;
  handleChangeTypeOfAuthForm: () => void;
};
export const LoginForm = (props: Props) => {
  const { loginData, handleChangeData, handleLogin, handleChangeTypeOfAuthForm } = props;

  return (
    <>
      <InputEmail
        label='Электронная почта'
        placeholder='Введите электронную почту'
        value={loginData?.username}
        onChange={value => handleChangeData('username', value)}
      />
      <InputText
        placeholder='Введите пароль'
        label='Пароль'
        type='password'
        value={loginData?.password}
        onChange={value => handleChangeData('password', value)}
      />
      <div className='auth-page__container__actions'>
        <Button stretched onClick={handleLogin}>
          Войти
        </Button>
        <div className='auth-page__container__actions__no-account'>
          Нет аккаунта? <button onClick={handleChangeTypeOfAuthForm}>Зарегистрироваться</button>
        </div>
      </div>
    </>
  );
};
