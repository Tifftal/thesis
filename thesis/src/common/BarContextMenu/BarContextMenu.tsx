import { ReactNode } from 'react';

import { Dropdown } from 'antd';

import './bar-context-menu.css';

type Props = {
  renderContextMenu: () => ReactNode;
  children: ReactNode;
};

export const BarContextMenu = (props: Props) => {
  const { renderContextMenu, children } = props;

  const renderBarContextMenu = () => {
    return <div className='context_menu__container'>{renderContextMenu()}</div>;
  };

  return (
    <Dropdown trigger={['contextMenu']} dropdownRender={renderBarContextMenu}>
      {children}
    </Dropdown>
  );
};
