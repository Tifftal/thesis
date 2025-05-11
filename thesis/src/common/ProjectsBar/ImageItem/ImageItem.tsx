/* eslint-disable complexity */
import { useEffect, useState } from 'react';

import { IconCheck, IconChevronDown, IconChevronUp, IconEditCircle, IconPlus } from '@tabler/icons-react';
import cn from 'classnames';

import { LAYER_API } from 'services/API/LAYER_API';
import useStore from 'services/zustand/store';
import {
  ImageType,
  LayerType,
  SavedBrokenLine,
  SavedCircle,
  SavedEllipse,
  SavedLine,
  SavedPolygon,
  SavedRectangle,
  ZustandStoreStateType,
} from 'services/zustand/types';

import { InputText } from 'ui-kit/inputs/InputText';

import { LayerItem } from '../LayerItem/LayerItem';

import { BarContextMenu } from 'common/BarContextMenu/BarContextMenu';

import { EditModalItemType, EditModalType } from 'common/EditModal/types';

import {
  getSavedBrokenLine,
  getSavedCircle,
  getSavedEllipse,
  getSavedLine,
  getSavedPolygon,
  getSavedRectangle,
  mergeMeasurements,
} from 'utils/helpers';

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
    selectedImage,
    setSelectedImage,
    selectedProject,
    setSelectedProject,
    setVisibleLayers,
    setSelectedLayer,
    selectedTool,
    setSelectedTool,
    generatedObjects,
    setIsVisibleGeneratedLayer,
    setIsOpenAddObjectModal,
    savedMeasurements,
    setSavedMeasurements,
    scaleFactor,
  } = useStore((state: ZustandStoreStateType) => state);

  const [isOpenLayers, setIsOpenLayers] = useState<boolean>(false);
  const [isAddingLayer, setIsAddingLayer] = useState<boolean>(false);
  const [layerName, setLayerName] = useState<string>('');

  const handleSelectImage = () => {
    setSelectedImage(image);
    setVisibleLayers(image.layers);
    setSelectedLayer(image.layers[0]);
    setIsOpenLayers(true);
    setIsVisibleGeneratedLayer(false);
    !selectedTool && setSelectedTool('line');
    !open && setOpen(true);
  };

  useEffect(() => {
    if (!open) setIsOpenLayers(false);
    if (selectedImage?.url === image.url) setIsOpenLayers(true);
  }, [open, selectedImage]);

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

          const newSelectedImage = updatedImages?.filter(image => image.id === selectedImage?.id)[0] || null;

          setSelectedImage(newSelectedImage);
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

  const handleSaveAllObjects = (e: React.MouseEvent, layer: LayerType) => {
    e.stopPropagation();
    if (!selectedImage) return;
    const currentImageMeasurements = savedMeasurements ? savedMeasurements[selectedImage.id] || {} : {};

    const scaledLayerMeasurements: Record<string, any> = {};
    Object.keys(layer.measurements).forEach(key => {
      switch (key) {
        case 'lines': {
          if (!Array.isArray(layer.measurements?.lines)) break;

          const newLines: SavedLine[] = [];

          for (const item of layer.measurements.lines) {
            const savedLine = getSavedLine(item, scaleFactor, onMessage, savedMeasurements, selectedImage);

            if (savedLine) {
              newLines.push(savedLine);
            }
          }
          scaledLayerMeasurements.lines = newLines;
          break;
        }
        case 'brokenLines': {
          if (!Array.isArray(layer.measurements?.brokenLines)) break;

          const newBrokenLines: SavedBrokenLine[] = [];

          for (const item of layer.measurements.brokenLines) {
            const savedBrokenLine = getSavedBrokenLine(
              item,
              scaleFactor,
              onMessage,
              savedMeasurements,
              selectedImage,
            );

            if (savedBrokenLine) {
              newBrokenLines.push(savedBrokenLine);
            }
          }
          scaledLayerMeasurements.brokenLines = newBrokenLines;
          break;
        }
        case 'polygons': {
          if (!Array.isArray(layer.measurements?.polygons)) break;

          const newPolygons: SavedPolygon[] = [];

          for (const item of layer.measurements.polygons) {
            const savedPolygon = getSavedPolygon(
              item,
              scaleFactor,
              onMessage,
              savedMeasurements,
              selectedImage,
            );

            if (savedPolygon) {
              newPolygons.push(savedPolygon);
            }
          }
          scaledLayerMeasurements.polygons = newPolygons;
          break;
        }
        case 'rectangles': {
          if (!Array.isArray(layer.measurements?.rectangles)) break;

          const newRectangles: SavedRectangle[] = [];

          for (const item of layer.measurements.rectangles) {
            const savedRectangle = getSavedRectangle(
              item,
              scaleFactor,
              onMessage,
              savedMeasurements,
              selectedImage,
            );

            if (savedRectangle) {
              newRectangles.push(savedRectangle);
            }
          }
          scaledLayerMeasurements.rectangles = newRectangles;
          break;
        }
        case 'circles': {
          if (!Array.isArray(layer.measurements?.circles)) break;

          const newCircles: SavedCircle[] = [];

          for (const item of layer.measurements.circles) {
            const savedCircle = getSavedCircle(
              item,
              scaleFactor,
              onMessage,
              savedMeasurements,
              selectedImage,
            );

            if (savedCircle) {
              newCircles.push(savedCircle);
            }
          }
          scaledLayerMeasurements.circles = newCircles;
          break;
        }
        case 'ellipses': {
          if (!Array.isArray(layer.measurements?.ellipses)) break;

          const newEllipses: SavedEllipse[] = [];

          for (const item of layer.measurements.ellipses) {
            const savedEllipse = getSavedEllipse(
              item,
              scaleFactor,
              onMessage,
              savedMeasurements,
              selectedImage,
            );

            if (savedEllipse) {
              newEllipses.push(savedEllipse);
            }
          }
          scaledLayerMeasurements.ellipses = newEllipses;
          break;
        }
        default:
          break;
      }
    });

    const newSavedMeasurements = mergeMeasurements(currentImageMeasurements, scaledLayerMeasurements);
    setSavedMeasurements({
      ...savedMeasurements,
      [selectedImage.id]: newSavedMeasurements,
    });
  };

  const renderContextMenu = (item: LayerType) => {
    return (
      <>
        <div className='context_menu__item' onClick={e => handleOpenEditModal(e, item, 'LAYER')}>
          Изменить
        </div>
        <div className='context_menu__item' onClick={e => handleSaveAllObjects(e, item)}>
          Сохранить все объекты
        </div>
      </>
    );
  };

  const renderContextMenuGeneratedLayer = () => {
    return (
      <>
        <div
          className='context_menu__item'
          onClick={e => {
            e.stopPropagation();
            generatedObjects &&
              setIsOpenAddObjectModal({ visible: true, selectedObject: generatedObjects[image.id] });
          }}>
          Перенести все измерения в слой
        </div>
      </>
    );
  };

  return (
    <>
      <div className={cn('image-item__container', { active: selectedImage?.url === image.url })}>
        <div
          className={cn(
            'image-item__title',
            { active: selectedImage?.url === image.url },
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
            {generatedObjects && generatedObjects[image.id] && (
              <BarContextMenu renderContextMenu={renderContextMenuGeneratedLayer}>
                <div>
                  <LayerItem layer={null} image={image} />
                </div>
              </BarContextMenu>
            )}
            <button onClick={handleCreateLayer}>
              {isAddingLayer ? (
                <IconChevronUp width={13} height={13} stroke={3} />
              ) : (
                <IconPlus width={13} height={13} stroke={3} />
              )}
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
                <div>
                  <LayerItem layer={layer} image={image} />
                </div>
              </BarContextMenu>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
