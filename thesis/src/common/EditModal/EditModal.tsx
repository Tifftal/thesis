import { useEffect, useState } from 'react';

import { IMAGE_API } from 'services/API/IMAGE_API';
import { LAYER_API } from 'services/API/LAYER_API';
import { PROJECT_API } from 'services/API/PROJECT_API';
import useStore from 'services/zustand/store';
import { ZustandStoreStateType } from 'services/zustand/types';

import { Button } from 'ui-kit/button';
import { InputText } from 'ui-kit/inputs/InputText';
import { Modal } from 'ui-kit/modal/Modal';

import { EditModalItemType, EditModalType, ResponseChangeImageType } from './types';

import useToast from 'utils/hooks/useToast';

import './edit-modal.css';

type Props = {
  editModal: { open: boolean; type: EditModalType };
  setEditModal: (value: { open: boolean; type: EditModalType }) => void;
  item?: EditModalItemType;
};

export const EditModal = (props: Props) => {
  const { editModal, setEditModal, item } = props;

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
  }, [editModal.open]);

  const handleClose = () => {
    setName('');
    setEditModal({ open: false, type: null });
  };

  const handleChangeName = () => {
    if (!item) return;

    switch (editModal.type) {
      case 'IMAGE': {
        if (!selectedProject) return;
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
        break;
      }
      case 'PROJECT': {
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
        break;
      }
      case 'LAYER': {
        if (!selectedProject) {
          onMessage('Ошибка', 'error', 'Не выбран проект');
          return;
        }
        LAYER_API.ChangeLayerName(item.id, { name })
          .then(() => {
            PROJECT_API.GetProject(selectedProject?.id)
              .then(response => {
                setSelectedProject(response.data);
              })
              .catch(e => {
                onMessage(`${e}`, 'error', 'Ошибка получения проекта');
              });
          })
          .catch(e => {
            onMessage(`${e}`, 'error', 'Ошибка изменения слоя');
          });
        handleClose();
        break;
      }
      default:
        return;
    }
    handleClose();
  };

  const handleDelete = () => {
    if (!item) return;
    switch (editModal.type) {
      case 'IMAGE': {
        if (!selectedProject) return;
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
        break;
      }
      case 'PROJECT': {
        PROJECT_API.DeleteProject(item.id)
          .then(() => {
            const updatedProjects = projects?.filter(project => project.id !== item.id);

            setProjects(updatedProjects);
          })
          .catch(e => {
            onMessage(`${e}`, 'error', 'Ошибка удаления проекта');
          });
        break;
      }
      case 'LAYER': {
        if (!selectedProject) {
          onMessage('Ошибка', 'error', 'Не выбран проект');
          return;
        }
        LAYER_API.DeleteLayer(item.id)
          .then(() => {
            PROJECT_API.GetProject(selectedProject?.id)
              .then(response => {
                setSelectedProject(response.data);
              })
              .catch(e => {
                onMessage(`${e}`, 'error', 'Ошибка получения проекта');
              });
          })
          .catch(e => {
            onMessage(`${e}`, 'error', 'Ошибка удаления слоя');
          });
        break;
      }
      default:
        return;
    }

    handleClose();
  };

  const renderTitle = () => {
    switch (editModal.type) {
      case 'IMAGE':
        return 'Редактирование изображения';
      case 'PROJECT':
        return 'Редактирование проекта';
      case 'LAYER':
        return 'Редактирование слоя';
      default:
        return undefined;
    }
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
    <Modal isOpen={editModal.open} onCancel={handleClose} width={500} isCentered title={renderTitle()}>
      <div className='edit-modal__content'>
        {renderModalContent()}
        <div className='edit-modal__actions'>
          <Button
            onClick={name === item?.name ? handleClose : handleChangeName}
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
