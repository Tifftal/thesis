import { useEffect, useState } from 'react';

import { IconCheck, IconChevronDown, IconChevronUp, IconEditCircle, IconPlus } from '@tabler/icons-react';
import cn from 'classnames';

import { LAYER_API } from 'services/API/LAYER_API';
import useStore from 'services/zustand/store';
import { ImageType, LayerType, ZustandStoreStateType } from 'services/zustand/types';

import { InputText } from 'ui-kit/inputs/InputText';

import { BarContextMenu } from 'common/BarContextMenu/BarContextMenu';

import { EditModalItemType, EditModalType } from 'common/EditModal/types';

import useToast from 'utils/hooks/useToast';
import './image-item.css';

type Props = {
  image: ImageType;
  open: boolean;
  setOpen: (value: boolean) => void;
  handleOpenEditModal: (e: any, item: EditModalItemType, type: EditModalType) => void;
};

export const ImageItem = (props: Props) => {
  const { image, open, setOpen, handleOpenEditModal } = props;

  const { onMessage } = useToast();

  const {
    selectedImageURL,
    setSelectedImageURL,
    selectedProject,
    setSelectedProject,
    selectedLayer,
    setSelectedLayer,
  } = useStore((state: ZustandStoreStateType) => state);

  const [isOpenLayers, setIsOpenLayers] = useState<boolean>(false);
  const [isAddingLayer, setIsAddingLayer] = useState<boolean>(false);
  const [layerName, setLayerName] = useState<string>('');

  const handleSelectImage = () => {
    setSelectedImageURL(image.url);
    setSelectedLayer(null);
    setIsOpenLayers(true);
    !open && setOpen(true);
  };

  useEffect(() => {
    if (!open) setIsOpenLayers(false);
  }, [open]);

  const handleToggleLayers = (e: any) => {
    e.stopPropagation();
    setIsOpenLayers(state => !state);
  };

  const handleCreateLayer = () => {
    if (isAddingLayer && selectedProject && layerName) {
      LAYER_API.CreateLayer({
        imageID: image.id,
        name: layerName,
      })
        .then(response => {
          const newLayers = [...image.layers, response.data];
          const newImage = { ...image, layers: newLayers };
          const updatedImages = selectedProject?.images?.map(img => {
            return img.id === image.id ? newImage : img;
          });

          setSelectedProject({
            ...selectedProject,
            images: updatedImages,
          });
        })
        .catch(e => {
          onMessage(`${e}`, 'error', 'Ошибка добавления слоя');
        });

      setIsAddingLayer(false);
      setLayerName('');
    }
    if (isAddingLayer) {
      setIsAddingLayer(false);
    } else {
      setIsAddingLayer(true);
    }
  };

  const renderContextMenu = (item: LayerType) => {
    return (
      <>
        <div className='context_menu__item' onClick={e => handleOpenEditModal(e, item, 'LAYER')}>
          Переименовать
        </div>
        <div className='context_menu__item' style={{ color: 'var(--color-red)' }}>
          Удалить
        </div>
      </>
    );
  };

  return (
    <>
      <div className={cn('image-item__container', { active: selectedImageURL === image.url })}>
        <div
          className={cn(
            'image-item__title',
            { active: selectedImageURL === image.url },
            { collapsed: !open },
          )}
          onClick={handleSelectImage}>
          {open ? (
            <>
              <IconEditCircle
                width={20}
                height={20}
                stroke={1.5}
                onClick={e => handleOpenEditModal(e, image, 'IMAGE')}
              />
              <div className='image-item__content__item__image'>
                <img src={`http://${image.url}`} />
                <span className='image-item__content__item__name'>{image.name}</span>
              </div>
              {isOpenLayers ? (
                <IconChevronUp width={20} height={20} stroke={1.5} onClick={handleToggleLayers} />
              ) : (
                <IconChevronDown width={20} height={20} stroke={1.5} onClick={handleToggleLayers} />
              )}
            </>
          ) : (
            <img src={`http://${image.url}`} />
          )}
        </div>
        {open && (
          <div className={cn('image-item__layers__container', { active: isOpenLayers })}>
            <button onClick={handleCreateLayer}>
              <IconPlus width={13} height={13} stroke={3} />
              слой
            </button>
            {isAddingLayer && (
              <div className='image-item__layers__add-input'>
                <InputText
                  placeholder='Название слоя'
                  value={layerName}
                  onChange={value => setLayerName(value)}
                  height={26}
                />
                <IconCheck width={16} height={16} stroke={3} onClick={handleCreateLayer} />
              </div>
            )}
            {image.layers?.map((layer, index) => (
              <BarContextMenu key={index} renderContextMenu={() => renderContextMenu(layer)}>
                <div
                  className={cn('image-item__layers__item', { active: selectedLayer?.id === layer.id })}
                  onClick={() => setSelectedLayer(layer)}>
                  <span>#{layer.id}</span>
                  {layer.name}
                </div>
              </BarContextMenu>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
