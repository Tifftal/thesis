import { useEffect, useState } from 'react';

import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { AUTH_API } from 'services/API/AUTH_API';
import useStore from 'services/zustand/store';
import { ZustandStoreStateType } from 'services/zustand/types';

import { Loader } from 'ui-kit/loader';

import { MetricsBar } from 'common/MetricsBar';
import { Navbar } from 'common/Navbar';
import { ProjectsBar } from 'common/ProjectsBar';

import useToast from 'utils/hooks/useToast';

export const RouteLayout = () => {
  const navigate = useNavigate();
  const { onMessage } = useToast();
  const location = useLocation();
  const { userInfo, setUserInfo, isGeneratingObjects } = useStore((state: ZustandStoreStateType) => state);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    if (location.pathname.startsWith('/auth')) {
      setIsCheckingAuth(false);
      return;
    }

    const checkAuth = async () => {
      try {
        if (!location.pathname.startsWith('/auth') && !userInfo.id) {
          const response = await AUTH_API.GetMe();
          setUserInfo(response.data);
        }
      } catch (e) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        navigate('/auth/login');
        onMessage('Сессия истекла. Пожалуйста, войдите снова', 'error', 'Ошибка авторизации');
      } finally {
        setIsCheckingAuth(false);
      }
    };

    const token = localStorage.getItem('token');
    if (token) {
      checkAuth();
    } else {
      setIsCheckingAuth(false);
      if (!location.pathname.startsWith('/auth')) {
        navigate('/auth/login');
      }
    }
  }, [location.pathname, navigate, onMessage, setUserInfo, userInfo.id]);

  if (isCheckingAuth) {
    return <Loader title='Проверка пользователя...' size='large' />;
  }

  if (location.pathname.startsWith('/auth')) {
    return <Outlet />;
  }

  return (
    <div className='route-layout__container'>
      <Navbar />
      {isGeneratingObjects && <Loader title='Идет распознавание объектов...' size='large' />}
      <ProjectsBar />
      <MetricsBar />
      <Outlet />
    </div>
  );
};
