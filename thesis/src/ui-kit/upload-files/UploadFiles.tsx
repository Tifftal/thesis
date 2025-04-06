import { ReactElement } from 'react';

import { IconUpload } from '@tabler/icons-react';
import { Upload, ConfigProvider } from 'antd';

type Props = {
  accept: string;
  className?: string;
  beforeUpload: (file: File) => boolean;
  showUploadList: boolean;
  onChange: (value: any) => void;
  children?: ReactElement;
};

const defaultChildren = (
  <div className='upload-files__btn'>
    <IconUpload width={16} height={16} stroke={2} /> Загрузить файл
  </div>
);

export const UploadFiles = (props: Props) => {
  const { children = defaultChildren } = props;

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#D2233C',
        },
      }}>
      <Upload {...props}>{children}</Upload>
    </ConfigProvider>
  );
};
