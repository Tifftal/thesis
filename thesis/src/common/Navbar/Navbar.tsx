import { useNavigate } from 'react-router-dom';

import useStore from 'services/zustand/store';
import { ZustandStoreStateType } from 'services/zustand/types';

import { Button } from 'ui-kit/button';

import Logo from 'assets/images/logo/Logo.png';

import { NavbarMenu } from './NavbarMenu';
import { ProjectParameters } from './ProjectParameters/ProjectParameters';

export const Navbar = () => {
  const navigate = useNavigate();

  const {
    userInfo,
    setProjects,
    setSelectedImage,
    setSelectedLayer,
    setSelectedTool,
    setSelectedProject,
    setVisibleLayers,
  } = useStore((state: ZustandStoreStateType) => state);

  const handleLogout = () => {
    localStorage.clear();
    setProjects([]);
    setSelectedProject(null);
    setSelectedImage(null);
    setSelectedLayer(null);
    setSelectedTool(null);
    setVisibleLayers([]);
    navigate('/auth');
  };

  return (
    <div className='navbar'>
      <div className='navbar__container'>
        <div className='navbar__container__logo'>
          <img src={Logo} alt='Logotype' />
          СИРОГС
        </div>
        <div className='navbar__container__user'>
          {`${userInfo.lastName} ${userInfo.firstName[0]}. ${userInfo.patronymic ? userInfo.patronymic[0] + '.' : ''}`}
          <Button size='s' type='red' onClick={handleLogout}>
            Выйти
          </Button>
        </div>
      </div>
      <div className='navbar__bottom-container'>
        <NavbarMenu />
        <ProjectParameters />
      </div>
    </div>
  );
};
