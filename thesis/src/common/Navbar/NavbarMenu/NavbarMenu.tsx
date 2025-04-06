import cn from 'classnames';

import useStore from 'services/zustand/store';
import { ZustandStoreStateType } from 'services/zustand/types';

import { IconButton } from 'ui-kit/icon-button';

import { NAVBAR_TOOL_ITEMS } from './constants';

export const NavbarMenu = () => {
  const { selectedTool, setSelectedTool } = useStore((state: ZustandStoreStateType) => state);

  const handleChoseTool = (key: string) => {
    setSelectedTool(key);
  };

  return (
    <div className='navbar-menu__container'>
      {NAVBAR_TOOL_ITEMS.map(({ key, IconComponent, tooltip }) => (
        <IconButton
          key={key}
          className={cn('navbar-btn', { active: selectedTool === key })}
          icon={<IconComponent stroke={1.5} />}
          tooltip={tooltip}
          onClick={() => handleChoseTool(key)}
        />
      ))}
    </div>
  );
};
