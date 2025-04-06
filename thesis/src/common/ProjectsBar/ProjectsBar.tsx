import { ReactElement, useEffect, useState } from 'react';

import { IconArrowBarToLeft, IconArrowBarToRight, IconPlus } from '@tabler/icons-react';
import { Breadcrumb } from 'antd';
import cn from 'classnames';

import useStore from 'services/zustand/store';
import { ZustandStoreStateType } from 'services/zustand/types';

import { Tooltip } from 'ui-kit/tooltip';
import { UploadFiles } from 'ui-kit/upload-files';

import { AddModal } from 'common/AddModal';

import Bone from 'assets/images/mock/bone_cells.jpg';
import Breast from 'assets/images/mock/breast_cancer.jpg';

export const ProjectsBar = () => {
  const imagesMock = [Bone, Breast];

  const { selectedProjectId, setSelectedProjectId, selectedImage, setSelectedImage } = useStore(
    (state: ZustandStoreStateType) => state,
  );

  const defaultBreadcrumbItem = {
    title: (
      <span
        onClick={() => setSelectedProjectId(null)}
        className={`projects-bar__header__title ${selectedProjectId ? 'chosen' : ''}`}>
        Проекты
      </span>
    ),
  };

  const [open, setOpen] = useState<boolean>(true);
  const [breadcrumbItems, setBreadcrumbItems] = useState<Record<string, ReactElement>[]>([
    defaultBreadcrumbItem,
  ]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);

  const PROJECTS_LIST = [
    {
      id: 1,
      name: 'Transmission electron microscopy',
    },
    {
      id: 2,
      name: 'Light microscope',
    },
  ];

  const IMAGES_LIST = [
    {
      id: 1,
      name: 'breast_cancer.jpg',
    },
    {
      id: 2,
      name: 'bone_cells.jpg',
    },
  ];

  const mockFile = [
    new File([''], 'breast_cancer.jpg', { type: 'image/jpg' }),
    new File([''], 'bone_cells.jpg', { type: 'image/jpg' }),
  ];

  useEffect(() => {
    const selectedProject = PROJECTS_LIST.find(item => item.id === selectedProjectId);
    if (selectedProjectId === null) {
      setSelectedImage(null);
      setBreadcrumbItems([defaultBreadcrumbItem]);
    } else {
      setBreadcrumbItems([
        defaultBreadcrumbItem,
        { title: <span className='projects-bar__header__title'>{selectedProject?.name}</span> },
      ]);
    }
  }, [selectedProjectId]);

  const handleChooseProject = (id: number) => {
    setSelectedProjectId(id);
  };

  const renderBarContent = () => {
    if (!selectedProjectId) {
      return (
        <div className='projects-bar__content'>
          {PROJECTS_LIST.map((item, index) => (
            <div
              className={`projects-bar__content__item ${open ? '' : 'collapsed'}`}
              onClick={() => handleChooseProject(item.id)}
              key={index}>
              {open ? (
                <>
                  <span>#{item.id}</span>
                  {item.name}
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
        {IMAGES_LIST.length > 0 ? (
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

            {IMAGES_LIST.map((item, index) => (
              <div
                className={cn(
                  'projects-bar__content__item',
                  { collapsed: !open },
                  { active: selectedImage?.name === item.name },
                )}
                key={index}
                onClick={() => setSelectedImage(mockFile[index])}>
                <img src={imagesMock[index]} />
                {open && item.name}
              </div>
            ))}
          </div>
        ) : null}
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
        {open && !selectedProjectId && (
          <div className='projects-bar__add-btn' onClick={() => setOpenModal(true)}>
            <Tooltip title='Создать проект'>
              <IconPlus stroke={1.4} color='var(--color-grey7)' />
            </Tooltip>
          </div>
        )}
      </div>
      {renderBarContent()}
      <AddModal open={openModal} setOpen={setOpenModal} file={file} setFile={setFile} />
    </div>
  );
};
