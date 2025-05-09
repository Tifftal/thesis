import { useState } from 'react';

import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { ConfigProvider, Select as SelectAntd } from 'antd';

import './select.css';

type Props = {
  onChange: (value: { label: string; value: any }[]) => void;
  value: any;
  options: { label: string; value: any }[];
  placeholder?: string;
  onDropdownVisibleChange?: (open: boolean) => void;
};

export const Select = (props: Props) => {
  const { onChange, value, options, placeholder, onDropdownVisibleChange } = props;

  const [open, setIsOpen] = useState<boolean>(false);

  return (
    <ConfigProvider
      theme={{
        components: {
          Select: {
            activeBorderColor: '#5b8c00',
            activeOutlineColor: '#5b8c0010',
            hoverBorderColor: '#5b8c00',
            optionSelectedBg: '#5b8c0030',
          },
        },
      }}>
      <div className='select'>
        <SelectAntd
          value={value}
          onChange={onChange}
          options={options}
          placeholder={placeholder}
          onDropdownVisibleChange={open => {
            setIsOpen(open);
            onDropdownVisibleChange && onDropdownVisibleChange(open);
          }}
          suffixIcon={
            open ? (
              <IconChevronUp width={20} height={20} stroke={1.5} color='#5b8c00' />
            ) : (
              <IconChevronDown width={20} height={20} stroke={1.5} />
            )
          }
        />
      </div>
    </ConfigProvider>
  );
};
