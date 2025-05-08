import { useState } from 'react';

import { IconChevronUp, IconColumns } from '@tabler/icons-react';
import { Dropdown } from 'antd';

import { Switch } from 'ui-kit/switch/Switch';

import { TableColumnsType } from '../MeasurementTable/types';

import './column-select.css';

type Props = {
  columns: TableColumnsType;
  setColumns: (value: TableColumnsType) => void;
};

export const ColumnSelect = (props: Props) => {
  const { columns, setColumns } = props;
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleChangeVisibleColumns = (key: string, visible: boolean) => {
    setColumns({
      ...columns,
      [key]: {
        ...columns[key],
        visible,
      },
    });
  };

  const handleVisibleChange = (visible: boolean) => {
    setDropdownVisible(visible);
  };

  const renderDropdown = () => (
    <div className='column-select__container'>
      {Object.entries(columns).map(([key, column]) => (
        <div key={key} className='column-select__item'>
          <span>{column.title}</span>
          <Switch
            checked={column.visible}
            size='small'
            onChange={(checked: boolean) => handleChangeVisibleColumns(key, checked)}
          />
        </div>
      ))}
    </div>
  );

  return (
    <Dropdown
      open={dropdownVisible}
      onOpenChange={handleVisibleChange}
      trigger={['click']}
      dropdownRender={renderDropdown}>
      {dropdownVisible ? (
        <IconChevronUp
          width={18}
          height={18}
          stroke={1.5}
          className='column-select__btn column-select__btn--active'
        />
      ) : (
        <IconColumns width={18} height={18} stroke={1.5} className='column-select__btn' />
      )}
    </Dropdown>
  );
};
