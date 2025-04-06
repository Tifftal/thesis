import { useNavigate } from 'react-router-dom';

import useStore from 'services/zustand/store';
import { ZustandStoreStateType } from 'services/zustand/types';

import { Button } from 'ui-kit/button';
import { InputEmail } from 'ui-kit/inputs/InputEmail';
import { InputText } from 'ui-kit/inputs/InputText';

import Logo from 'assets/images/logo/Logo.png';

export const AuthPage = () => {
  const navigate = useNavigate();

  const { typeOfAuthForm, setTypeOfAuthForm } = useStore((state: ZustandStoreStateType) => state);

  const handleChangeTypeOfAuthForm = (type: 'login' | 'registration') => {
    setTypeOfAuthForm(type);
  };

  const handleLogin = () => {
    localStorage.setItem('token', '123');
    navigate('/main');
  };

  const handleRegister = () => {
    localStorage.setItem('token', '123');
    navigate('/main');
  };

  return (
    <div className='page__container auth-page'>
      <div className='auth-page__container'>
        <div className='auth-page__container__header'>
          <div className='auth-page__container__logo'>
            <img src={Logo} alt='Logotype' />
            СИРОГС
          </div>
          <div className='auth-page__container__title'>
            {typeOfAuthForm === 'registration' ? 'Регистрация в системе' : 'Вход в систему'}
          </div>
        </div>
        {typeOfAuthForm === 'login' ? (
          <>
            <InputEmail
              label='Электронная почта'
              placeholder='Введите электронную почту'
              value={undefined}
              onChange={() => {}}
            />
            <InputText
              placeholder='Введите пароль'
              label='Пароль'
              type='password'
              value={undefined}
              onChange={() => {}}
            />
            <div className='auth-page__container__actions'>
              <Button stretched onClick={handleLogin}>
                Войти
              </Button>
              <div className='auth-page__container__actions__no-account'>
                Нет аккаунта?{' '}
                <button onClick={() => handleChangeTypeOfAuthForm('registration')}>Зарегестрироваться</button>
              </div>
            </div>
          </>
        ) : (
          <>
            <InputText placeholder='Иванов' label='Фамилия' value={undefined} onChange={() => {}} />
            <InputText placeholder='Иван' label='Имя' value={undefined} onChange={() => {}} />
            <InputText placeholder='Иванович' label='Отчество' value={undefined} onChange={() => {}} />
            <InputEmail
              label='Электронная почта'
              placeholder='Введите электронную почту'
              value={undefined}
              onChange={() => {}}
            />
            <InputText
              placeholder='Введите пароль'
              label='Пароль'
              type='password'
              value={undefined}
              onChange={() => {}}
            />
            <InputText placeholder='Повторите пароль' type='password' value={undefined} onChange={() => {}} />
            <div className='auth-page__container__actions'>
              <Button stretched onClick={handleRegister}>
                Зарегестрироваться
              </Button>
              <div className='auth-page__container__actions__no-account'>
                Уже есть аккаунт? <button onClick={() => handleChangeTypeOfAuthForm('login')}>Войти</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
