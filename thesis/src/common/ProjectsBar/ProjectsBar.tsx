import { ReactElement, useEffect, useState } from 'react';

import { IconArrowBarToLeft, IconArrowBarToRight, IconEditCircle, IconPlus } from '@tabler/icons-react';
import { Breadcrumb } from 'antd';

import { PROJECT_API } from 'services/API/PROJECT_API';
import useStore from 'services/zustand/store';
import { ZustandStoreStateType } from 'services/zustand/types';

import { Tooltip } from 'ui-kit/tooltip';

import { AddModal } from 'common/AddModal';
import { EditModal } from 'common/EditModal/EditModal';

import { EditModalItemType, EditModalType } from 'common/EditModal/types';

import { ImagesBar } from './ImagesBar/ImagesBar';

import useToast from 'utils/hooks/useToast';

export const ProjectsBar = () => {
  const { onMessage } = useToast();

  const {
    projects,
    setProjects,
    selectedProject,
    setSelectedProject,
    setSelectedImage,
    setVisibleLayers,
    setSelectedLayer,
  } = useStore((state: ZustandStoreStateType) => state);

  const [open, setOpen] = useState<boolean>(true);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [editModal, setEditModal] = useState<{ open: boolean; type: EditModalType }>({
    open: false,
    type: null,
  });
  const [editedItem, setEditedItem] = useState<EditModalItemType>(null);
  const [file, setFile] = useState<File | null>(null);

  const defaultBreadcrumbItem = {
    title: (
      <span
        onClick={() => setSelectedProject(null)}
        className={`projects-bar__header__title ${selectedProject ? 'chosen' : ''}`}>
        Проекты
      </span>
    ),
  };
  const [breadcrumbItems, setBreadcrumbItems] = useState<Record<string, ReactElement>[]>([
    defaultBreadcrumbItem,
  ]);

  useEffect(() => {
    PROJECT_API.GetAllProjects()
      .then(response => {
        setProjects(response.data);
      })
      .catch(e => {
        onMessage(`${e}`, 'error', 'Ошибка получения проектов');
      });
  }, []);

  useEffect(() => {
    if (selectedProject === null) {
      setSelectedImage(null);
      setVisibleLayers([]);
      setSelectedLayer(null);
      setBreadcrumbItems([defaultBreadcrumbItem]);
    } else {
      setBreadcrumbItems([
        defaultBreadcrumbItem,
        { title: <span className='projects-bar__header__title'>{selectedProject?.name}</span> },
      ]);
    }
  }, [selectedProject]);

  const handleChooseProject = (id: number) => {
    PROJECT_API.GetProject(id)
      .then(response => {
        setSelectedProject(response.data);
      })
      .catch(e => {
        onMessage(`${e}`, 'error', 'Ошибка получения проекта');
      });
  };

  const handleOpenEditModal = (e: any, item: EditModalItemType, type: EditModalType) => {
    e.stopPropagation();
    setEditedItem(item);
    setEditModal({ open: true, type: type });
  };

  const renderBarContent = () => {
    if (!selectedProject) {
      return (
        <div className={`projects-bar__container__content ${open ? '' : 'collapsed'}`}>
          {!projects.length ? (
            <div className={`projects-bar__content__empty ${open ? '' : 'collapsed'}`}>
              Пока не создано проектов...
            </div>
          ) : (
            <div className={`projects-bar__content ${open ? '' : 'collapsed'}`}>
              {projects?.map((item, index) => (
                <div
                  className={`projects-bar__content__item ${open ? '' : 'collapsed'}`}
                  onClick={() => handleChooseProject(item.id)}
                  key={index}>
                  {open ? (
                    <>
                      <>
                        <div className='projects-bar__content__item__image'>
                          <span className='projects-bar__content__item__number'>#{item.id}</span>
                          <span className='projects-bar__content__item__name'>{item.name}</span>
                        </div>
                        <IconEditCircle
                          width={20}
                          height={20}
                          stroke={1.5}
                          onClick={e => handleOpenEditModal(e, item, 'PROJECT')}
                        />
                      </>
                    </>
                  ) : (
                    `#${item.id}`
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }
    return (
      <>
        <div className={`projects-bar__image-content ${open ? '' : 'collapsed'}`}>
          <ImagesBar
            setOpenModal={setOpenModal}
            handleOpenEditModal={handleOpenEditModal}
            setFile={setFile}
            open={open}
            setOpen={setOpen}
          />
        </div>
      </>
    );
  };

  return (
    <div className={`projects-bar__container ${open ? 'open' : 'collapsed'}`}>
      <div className={`projects-bar__header ${open ? '' : 'collapsed'}`}>
        <div className='projects-bar__header__left'>
          <div className='projects-bar__icon-wrapper' onClick={() => setOpen(state => !state)}>
            <IconArrowBarToLeft
              className={`icon-transition ${open ? 'visible' : 'hidden'}`}
              stroke={1.4}
              color='var(--color-grey7)'
            />
            <IconArrowBarToRight
              className={`icon-transition ${open ? 'hidden' : 'visible'}`}
              stroke={1.4}
              color='var(--color-grey7)'
            />
          </div>
          {open && <Breadcrumb items={breadcrumbItems} />}
        </div>
        {open && !selectedProject && (
          <div className='projects-bar__add-btn' onClick={() => setOpenModal(true)}>
            <Tooltip title='Создать проект'>
              <IconPlus stroke={1.4} color='var(--color-grey7)' />
            </Tooltip>
          </div>
        )}
      </div>
      {renderBarContent()}
      <AddModal open={openModal} setOpen={setOpenModal} file={file} setFile={setFile} />
      <EditModal editModal={editModal} setEditModal={setEditModal} item={editedItem} />
    </div>
  );
};
