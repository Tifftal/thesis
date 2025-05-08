import { ConfigProvider, Spin as SpinAntd } from 'antd';

type Props = {
  title?: string;
  size?: 'default' | 'small' | 'large';
};

export const Loader = (props: Props) => {
  const { title, size } = props;

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#486e00',
        },
      }}>
      <div className='loader'>
        <SpinAntd tip={title} size={size} />
      </div>
    </ConfigProvider>
  );
};
