import { ConfigProvider, Switch as SwitchAntd } from 'antd';
import { SwitchSize } from 'antd/es/switch';

type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  defaultChecked?: boolean;
  size?: SwitchSize;
};

export const Switch = (props: Props) => {
  const { onChange, defaultChecked, size, checked } = props;

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#5b8c00',
          colorPrimaryHover: '#486e00',
        },
      }}>
      <SwitchAntd checked={checked} onChange={onChange} defaultChecked={defaultChecked} size={size} />
    </ConfigProvider>
  );
};
