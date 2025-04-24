import { Outlet, useNavigate } from 'react-router-dom';

import { MetricsBar } from 'common/MetricsBar';
import { Navbar } from 'common/Navbar';
import { ProjectsBar } from 'common/ProjectsBar';

export const RouteLayout = () => {
  useNavigate();

  const token = localStorage.getItem('token');

  if (!token) return <Outlet />;

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
