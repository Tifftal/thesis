import useStore from 'services/zustand/store';
import { ZustandStoreStateType } from 'services/zustand/types';

import { Button } from 'ui-kit/button';
import { InputText } from 'ui-kit/inputs/InputText';
import { Modal } from 'ui-kit/modal/Modal';

type Props = {
  open: boolean;
  setOpen: (value: boolean) => void;
  file?: File | null;
  setFile?: (value: File | null) => void;
};

export const AddModal = (props: Props) => {
  const { open, setOpen, file, setFile } = props;

  const { selectedProjectId, setSelectedImage } = useStore((state: ZustandStoreStateType) => state);

  const handleCreate = () => {
    if (file) setSelectedImage(file);
    setOpen(false);
  };

  const handleClose = () => {
    if (file && setFile) {
      setFile(null);
    }
    setOpen(false);
  };

  return (
    <Modal
      isOpen={open}
      onCancel={handleClose}
      width={500}
      isCentered
      title={selectedProjectId ? 'Добавление изображения' : 'Создание проекта'}>
      <div className='add-modal__content'>
        {file ? (
          <>
            <InputText label='Название' value={file.name} onChange={() => {}} height={46} />
            <div className='add-modal__preview'>
              <img src={URL.createObjectURL(file)} alt='Превью' className='add-modal__image' />
            </div>
          </>
        ) : (
          <InputText
            label='Название'
            placeholder='Введите название проекта'
            value={undefined}
            onChange={() => {}}
            height={46}
          />
        )}
        <div className='add-modal__actions'>
          <Button onClick={selectedProjectId ? handleCreate : handleClose} size='s' stretched>
            {selectedProjectId ? 'Добавить' : 'Создать'}
          </Button>
          <Button onClick={handleClose} size='s' type='grey' stretched>
            Отменить
          </Button>
        </div>
      </div>
    </Modal>
  );
};
