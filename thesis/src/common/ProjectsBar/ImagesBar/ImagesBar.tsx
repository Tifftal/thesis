import { IconPlus } from '@tabler/icons-react';
import cn from 'classnames';

import useStore from 'services/zustand/store';
import { ImageType, ProjectType, ZustandStoreStateType } from 'services/zustand/types';

import { UploadFiles } from 'ui-kit/upload-files';

import { ImageItem } from '../ImageItem/ImageItem';

import './images-bar.css';
import { EditModalItemType, EditModalType } from 'common/EditModal/types';

type Props = {
  setOpenModal: (value: boolean) => void;
  handleOpenEditModal: (e: any, item: EditModalItemType, type: EditModalType) => void;
  setFile: (value: File | null) => void;
  open: boolean;
  setOpen: (value: boolean) => void;
};

export const ImagesBar = (props: Props) => {
  const { setOpenModal, handleOpenEditModal, setFile, open, setOpen } = props;

  const { selectedProject } = useStore((state: ZustandStoreStateType) => state);

  return (
    <>
      <UploadFiles
        accept='.png,.jpeg,.jpg'
        beforeUpload={file => {
          setFile(file);
          setOpenModal(true);
          return false;
        }}
        showUploadList={false}
        onChange={() => {}}
        className={cn('images-bar__content__upload-btn', { collapsed: !open })}>
        <div className='images-bar__content__add-btn'>
          <IconPlus width={14} height={14} stroke={3} />
          Добавить изображение
        </div>
      </UploadFiles>

      {selectedProject?.images?.map((item, index) => (
        <ImageItem
          key={index}
          image={item}
          open={open}
          setOpen={setOpen}
          handleOpenEditModal={handleOpenEditModal}
        />
      ))}
    </>
  );
};
