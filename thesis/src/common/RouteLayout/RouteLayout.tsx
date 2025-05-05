import { useEffect, useState } from 'react';

import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { AUTH_API } from 'services/API/AUTH_API';
import useStore from 'services/zustand/store';
import { ZustandStoreStateType } from 'services/zustand/types';

import { MetricsBar } from 'common/MetricsBar';
import { Navbar } from 'common/Navbar';
import { ProjectsBar } from 'common/ProjectsBar';

import useToast from 'utils/hooks/useToast';

export const RouteLayout = () => {
  const navigate = useNavigate();
  const { onMessage } = useToast();
  const location = useLocation();
  const { userInfo, setUserInfo } = useStore((state: ZustandStoreStateType) => state);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (location.pathname !== '/auth' && !userInfo.id) {
          const response = await AUTH_API.GetMe();
          setUserInfo(response.data);
        }
      } catch (e) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        navigate('/auth');
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
      if (location.pathname !== '/auth') {
        navigate('/auth');
      }
    }
  }, [location.pathname, navigate, onMessage, setUserInfo, userInfo.id]);

  if (isCheckingAuth) {
    return <div>Загрузка...</div>;
  }

  if (location.pathname === '/auth') {
    return <Outlet />;
  }

  return (
    <div className='route-layout__container'>
      <Navbar />
      <ProjectsBar />
      <MetricsBar />
      <Outlet />
    </div>
  );
};
