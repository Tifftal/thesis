import { useEffect, useState } from 'react';

import { IMAGE_API } from 'services/API/IMAGE_API';
import { PROJECT_API } from 'services/API/PROJECT_API';
import useStore from 'services/zustand/store';
import { ImageType, ProjectType, ZustandStoreStateType } from 'services/zustand/types';

import { Button } from 'ui-kit/button';
import { InputText } from 'ui-kit/inputs/InputText';
import { Modal } from 'ui-kit/modal/Modal';

import { ResponseChangeImageType } from './types';

import useToast from 'utils/hooks/useToast';

import './edit-modal.css';

type Props = {
  open: boolean;
  setOpen: (value: boolean) => void;
  item?: ImageType | ProjectType | null;
};

export const EditModal = (props: Props) => {
  const { open, setOpen, item } = props;

  const { onMessage } = useToast();

  const {
    projects,
    setProjects,
    selectedProject,
    setSelectedProject,
    selectedImageURL,
    setSelectedImageURL,
  } = useStore((state: ZustandStoreStateType) => state);

  const [name, setName] = useState<string>('');

  useEffect(() => {
    setName(item?.name || '');
  }, [item]);

  const handleClose = () => {
    setName('');
    setOpen(false);
  };

  const handleChangeName = () => {
    if (selectedProject && item?.id && name !== item?.name) {
      IMAGE_API.ChangeImageName(item.id, { name })
        .then((response: ResponseChangeImageType) => {
          const updatedImages = selectedProject.images?.map(img => {
            return img.id === item.id ? response.data : img;
          });

          setSelectedProject({
            ...selectedProject,
            images: updatedImages,
          });
        })
        .catch(e => {
          onMessage(`${e}`, 'error', 'Ошибка изменения изображения');
        });
    }
    if (!selectedProject && item?.id && name !== item?.name) {
      PROJECT_API.ChangeProjectName(item.id, { name })
        .then(response => {
          const updatedProjects = projects?.map(project => {
            return project.id === item.id ? response.data : project;
          });
          setProjects(updatedProjects);
        })
        .catch(e => {
          onMessage(`${e}`, 'error', 'Ошибка изменения проекта');
        });
    }
    setName('');
    setOpen(false);
  };

  const handleDelete = () => {
    if (selectedProject && item?.id) {
      IMAGE_API.DeleteImage(item.id)
        .then(() => {
          const updatedImages = selectedProject.images?.filter(img => img.id !== item.id);

          setSelectedProject({
            ...selectedProject,
            images: updatedImages,
          });

          if ('url' in item && selectedImageURL === item.url) setSelectedImageURL(null);
        })
        .catch(e => {
          onMessage(`${e}`, 'error', 'Ошибка удаления изображения');
        });
    }
    if (!selectedProject && item?.id) {
      PROJECT_API.DeleteProject(item.id)
        .then(() => {
          const updatedProjects = projects?.filter(project => project.id !== item.id);

          setProjects(updatedProjects);
        })
        .catch(e => {
          onMessage(`${e}`, 'error', 'Ошибка удаления проекта');
        });
    }
    setName('');
    setOpen(false);
  };

  const renderModalContent = () => {
    return (
      <InputText
        label='Название'
        placeholder='Введите название'
        value={name}
        onChange={value => setName(value)}
        height={46}
      />
    );
  };

  return (
    <Modal
      isOpen={open}
      onCancel={handleClose}
      width={500}
      isCentered
      title={selectedProject ? 'Добавление изображения' : 'Создание проекта'}>
      <div className='edit-modal__content'>
        {renderModalContent()}
        <div className='edit-modal__actions'>
          <Button
            onClick={handleChangeName}
            size='s'
            type={name === item?.name ? 'secondary' : 'primary'}
            stretched>
            {name === item?.name ? 'Отменить' : 'Сохранить'}
          </Button>
          <Button onClick={handleDelete} size='s' type='red' stretched>
            Удалить
          </Button>
        </div>
      </div>
    </Modal>
  );
};
