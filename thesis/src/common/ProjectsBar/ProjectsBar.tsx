import { ReactElement, useEffect, useState } from 'react';

import { IconArrowBarToLeft, IconArrowBarToRight, IconEditCircle, IconPlus } from '@tabler/icons-react';
import { Breadcrumb } from 'antd';
import cn from 'classnames';

import { PROJECT_API } from 'services/API/PROJECT_API';
import useStore from 'services/zustand/store';
import { ImageType, ProjectType, ZustandStoreStateType } from 'services/zustand/types';

import { Tooltip } from 'ui-kit/tooltip';
import { UploadFiles } from 'ui-kit/upload-files';

import { AddModal } from 'common/AddModal';
import { EditModal } from 'common/EditModal/EditModal';

import { ImageItem } from './ImageItem/ImageItem';

import useToast from 'utils/hooks/useToast';

export const ProjectsBar = () => {
  const { onMessage } = useToast();

  const { projects, setProjects, selectedProject, setSelectedProject, setSelectedImageURL } = useStore(
    (state: ZustandStoreStateType) => state,
  );

  const [open, setOpen] = useState<boolean>(true);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [editedItem, setEditedItem] = useState<ImageType | ProjectType | null>(null);
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
      setSelectedImageURL(null);
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

  const handleOpenEditModal = (e: any, item: ImageType | ProjectType) => {
    e.stopPropagation();
    setEditedItem(item);
    setOpenEditModal(true);
  };

  const renderBarContent = () => {
    if (!selectedProject) {
      return (
        <div className='projects-bar__content'>
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
                      onClick={e => handleOpenEditModal(e, item)}
                    />
                  </>
                </>
              ) : (
                `#${item.id}`
              )}
            </div>
          ))}
        </div>
      );
    }
    return (
      <>
        <div className='projects-bar__content'>
          <UploadFiles
            accept='.png,.jpeg,.jpg'
            beforeUpload={file => {
              setFile(file);
              setOpenModal(true);
              return false;
            }}
            showUploadList={false}
            onChange={() => {}}
            className={cn('projects-bar__content__upload-btn', { collapsed: !open })}>
            <div className='projects-bar__content__add-btn'>
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
        </div>
      </>
    );
  };

  return (
    <div className={`projects-bar__container ${open ? 'open' : 'collapsed'}`}>
      <div className='projects-bar__header'>
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
      <EditModal open={openEditModal} setOpen={setOpenEditModal} item={editedItem} />
    </div>
  );
};
