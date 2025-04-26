import { useEffect, useState } from 'react';

import { IMAGE_API } from 'services/API/IMAGE_API';
import { LAYER_API } from 'services/API/LAYER_API';
import { PROJECT_API } from 'services/API/PROJECT_API';
import useStore from 'services/zustand/store';
import { ZustandStoreStateType } from 'services/zustand/types';

import { Button } from 'ui-kit/button';
import { InputText } from 'ui-kit/inputs/InputText';
import { Modal } from 'ui-kit/modal/Modal';

import useToast from 'utils/hooks/useToast';

type Props = {
  open: boolean;
  setOpen: (value: boolean) => void;
  file?: File | null;
  setFile?: (value: File | null) => void;
};

export const AddModal = (props: Props) => {
  const { open, setOpen, file, setFile } = props;

  const { onMessage } = useToast();

  const { projects, setProjects, selectedProject, setSelectedImageURL, setSelectedProject } = useStore(
    (state: ZustandStoreStateType) => state,
  );

  const [name, setName] = useState<string>('');

  useEffect(() => {
    file && setName(file.name);
  }, [file]);

  const handleCreate = () => {
    if (file && setFile && selectedProject) {
      IMAGE_API.CreateImage({
        projectID: selectedProject?.id,
        name: name,
        image: file,
      })
        .then(response => {
          let newImage = response.data;
          setSelectedImageURL(newImage.url);

          LAYER_API.CreateLayer({
            imageID: newImage.id,
            name: 'Новый слой',
          })
            .then(response => {
              newImage = { ...newImage, layers: [response.data] };

              const updatedImages = selectedProject.images
                ? [...selectedProject.images, newImage]
                : [newImage];

              setSelectedProject({
                ...selectedProject,
                images: updatedImages,
              });
            })
            .catch(e => {
              onMessage(`${e}`, 'error', 'Ошибка добавления слоя');
            });
        })
        .catch(e => {
          onMessage(`${e}`, 'error', 'Ошибка добавления изображения');
        })
        .finally(() => {
          setName('');
          setOpen(false);
        });
    }
  };

  const handleCreateProject = () => {
    PROJECT_API.CreateProject({ name })
      .then(response => {
        setSelectedProject(response.data);
        const newProjects = [...projects, response.data];
        setProjects(newProjects);
      })
      .catch(e => {
        onMessage(`${e}`, 'error', 'Ошибка создания проекта');
      })
      .finally(() => {
        setName('');
        setOpen(false);
      });
  };

  const handleClose = () => {
    if (file && setFile) {
      setFile(null);
    }
    setOpen(false);
  };

  const renderModalContent = () => {
    if (selectedProject && file) {
      return (
        <>
          <InputText label='Название' value={name} onChange={value => setName(value)} height={46} />
          <div className='add-modal__preview'>
            <img src={URL.createObjectURL(file)} alt='Превью' className='add-modal__image' />
          </div>
        </>
      );
    }
    return (
      <InputText
        label='Название'
        placeholder='Введите название проекта'
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
      <div className='add-modal__content'>
        {renderModalContent()}
        <div className='add-modal__actions'>
          <Button onClick={selectedProject ? handleCreate : handleCreateProject} size='s' stretched>
            {selectedProject ? 'Добавить' : 'Создать'}
          </Button>
          <Button onClick={handleClose} size='s' type='grey' stretched>
            Отменить
          </Button>
        </div>
      </div>
    </Modal>
  );
};
