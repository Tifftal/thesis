import { Spin as SpinAntd } from 'antd';

type Props = {
  title?: string;
  size?: 'default' | 'small' | 'large';
};

export const Loader = (props: Props) => {
  const { title, size } = props;

  return (
    <div className='loader'>
      <SpinAntd tip={title} size={size} fullscreen />
    </div>
  );
};
