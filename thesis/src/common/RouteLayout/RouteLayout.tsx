import { useEffect } from 'react';

import { Outlet, useNavigate } from 'react-router-dom';

import { AUTH_API } from 'services/API/AUTH_API';
import useStore from 'services/zustand/store';
import { ZustandStoreStateType } from 'services/zustand/types';

import { MetricsBar } from 'common/MetricsBar';
import { Navbar } from 'common/Navbar';
import { ProjectsBar } from 'common/ProjectsBar';

import useToast from 'utils/hooks/useToast';

export const RouteLayout = () => {
  useNavigate();
  const { onMessage } = useToast();

  const { userInfo, setUserInfo } = useStore((state: ZustandStoreStateType) => state);

  const token = localStorage.getItem('token');

  if (!token) return <Outlet />;

  useEffect(() => {
    if (token && !userInfo.id) {
      AUTH_API.GetMe()
        .then(response => setUserInfo(response.data))
        .catch(e => {
          onMessage(`${e}`, 'error', 'Ошибка входа');
        });
    }
  }, []);

  return (
    <>
      <div className='route-layout__container'>
        <Navbar />
        <ProjectsBar />
        <MetricsBar />
        <Outlet />
      </div>
    </>
  );
};
