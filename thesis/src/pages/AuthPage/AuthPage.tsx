import { useMemo, useState } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import { AUTH_API } from 'services/API/AUTH_API';
import useStore from 'services/zustand/store';
import { ZustandStoreStateType } from 'services/zustand/types';

import { LoginForm } from 'components/AuthForms/LoginForm/LoginForm';
import { RegisterForm } from 'components/AuthForms/RegisterForm/RegisterForm';

import { LoginDataType, RegisterDataType } from './types';

import Logo from 'assets/images/logo/Logo.png';

import useToast from 'hooks/useToast';

export const AuthPage = () => {
  const navigate = useNavigate();
  const { onMessage } = useToast();
  const { pathname } = useLocation();

  const isLoginForm = useMemo(() => pathname.includes('/auth/login'), [pathname]);

  const { setUserInfo } = useStore((state: ZustandStoreStateType) => state);

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

  const switchForm = (type: 'login' | 'registration') => {
    navigate(`/auth/${type}`);
    setRegisterData({
      firstName: '',
      lastName: '',
      password: '',
      patronymic: '',
      username: '',
    });
    setLoginData({
      username: '',
      password: '',
    });
  };

  const handleChangeData = (key: string, value: string) => {
    if (isLoginForm) {
      const newData = { ...loginData, [key]: value };
      setLoginData(newData as LoginDataType);
      return;
    }
    const newData = { ...registerData, [key]: value };
    setRegisterData(newData as RegisterDataType);
  };

  const handleLogin = async (data?: LoginDataType) => {
    try {
      const response = await AUTH_API.Login(data || loginData);
      localStorage.setItem('token', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      setUserInfo(response.data.user);
      navigate('/main', { replace: true });
    } catch (e) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      onMessage(`${e}`, 'error', 'Ошибка входа');
    }
  };

  const handleRegister = async () => {
    try {
      await AUTH_API.Register(registerData);
      await handleLogin({
        username: registerData.username,
        password: registerData.password,
      });
    } catch (e) {
      onMessage(`${e}`, 'error', 'Ошибка регистрации');
    }
  };

  const renderForm = () => {
    if (isLoginForm) {
      return (
        <LoginForm
          loginData={loginData}
          handleChangeData={handleChangeData}
          handleLogin={() => handleLogin()}
          handleChangeTypeOfAuthForm={() => switchForm('registration')}
        />
      );
    }
    return (
      <RegisterForm
        registerData={registerData}
        handleChangeData={handleChangeData}
        handleRegister={handleRegister}
        handleChangeTypeOfAuthForm={() => switchForm('login')}
      />
    );
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
            {isLoginForm ? 'Вход в систему' : 'Регистрация в системе'}
          </div>
        </div>
        {renderForm()}
      </div>
    </div>
  );
};
