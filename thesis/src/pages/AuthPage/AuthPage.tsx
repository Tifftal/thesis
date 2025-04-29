import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { AUTH_API } from 'services/API/AUTH_API';
import useStore from 'services/zustand/store';
import { ZustandStoreStateType } from 'services/zustand/types';

import { LoginForm } from 'components/AuthForms/LoginForm';
import { RegisterForm } from 'components/AuthForms/RegisterForm';

import { LoginDataType, RegisterDataType } from './types';

import Logo from 'assets/images/logo/Logo.png';

import useToast from 'hooks/useToast';

export const AuthPage = () => {
  const navigate = useNavigate();
  const { onMessage } = useToast();

  const { typeOfAuthForm, setTypeOfAuthForm, setUserInfo } = useStore(
    (state: ZustandStoreStateType) => state,
  );

  const [registerData, setRegisterData] = useState<RegisterDataType>({
    firstName: '',
    lastName: '',
    password: '',
    patronymic: '',
    username: '',
  });

  const [loginData, setLoginData] = useState<LoginDataType>({
    username: '',
    password: '',
  });

  useEffect(() => {
    if (localStorage.getItem('token')) navigate('/main');
  }, [localStorage.getItem('token')]);

  const handleChangeTypeOfAuthForm = (type: 'login' | 'registration') => {
    setTypeOfAuthForm(type);
  };

  const handleChangeData = (key: string, value: string) => {
    switch (typeOfAuthForm) {
      case 'registration': {
        const newData = { ...registerData, [key]: value };
        setRegisterData(newData as RegisterDataType);
        break;
      }
      case 'login': {
        const newData = { ...loginData, [key]: value };
        setLoginData(newData as LoginDataType);
        break;
      }
      default:
        return null;
    }
  };

  const handleLogin = (data?: LoginDataType) => {
    AUTH_API.Login(data || loginData)
      .then(response => {
        localStorage.setItem('token', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        setUserInfo(response.data.user);
      })
      .catch(e => {
        onMessage(`${e}`, 'error', 'Ошибка входа');
      });
  };

  const handleRegister = () => {
    AUTH_API.Register(registerData)
      .then(() => {
        handleLogin({
          username: registerData.username,
          password: registerData.password,
        });
      })
      .catch(e => {
        onMessage(`${e}`, 'error', 'Ошибка регистрации');
      });
  };

  const renderForm = () => {
    switch (typeOfAuthForm) {
      case 'login':
        return (
          <LoginForm
            loginData={loginData}
            handleChangeData={handleChangeData}
            handleLogin={() => handleLogin()}
            handleChangeTypeOfAuthForm={() => handleChangeTypeOfAuthForm('registration')}
          />
        );
      case 'registration':
        return (
          <RegisterForm
            registerData={registerData}
            handleChangeData={handleChangeData}
            handleRegister={handleRegister}
            handleChangeTypeOfAuthForm={() => handleChangeTypeOfAuthForm('login')}
          />
        );
      default:
        return null;
    }
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
        {renderForm()}
      </div>
    </div>
  );
};
