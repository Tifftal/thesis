import { useEffect, useState } from 'react';

import { IconEye, IconEyeOff } from '@tabler/icons-react';
import cn from 'classnames';

import useStore from 'services/zustand/store';
import { ImageType, LayerType, ZustandStoreStateType } from 'services/zustand/types';

type Props = {
  layer: LayerType | null;
  image: ImageType;
};

export const LayerItem = (props: Props) => {
  const { layer, image } = props;

  const {
    visibleLayers,
    setVisibleLayers,
    selectedLayer,
    setSelectedLayer,
    selectedImage,
    setSelectedImage,
    setIsVisibleGeneratedLayer,
  } = useStore((state: ZustandStoreStateType) => state);

  const [isVisibleLayer, setIsVisibleLayer] = useState<boolean>(
    visibleLayers.some(visibleLayer => visibleLayer.id === layer?.id),
  );

  useEffect(() => {
    setIsVisibleLayer(visibleLayers.some(visibleLayer => visibleLayer.id === layer?.id));
  }, [visibleLayers, selectedLayer]);

  const handleChangeVisibleLayers = (
    layer: LayerType,
    type: 'ADD' | 'DELETE',
    e?: React.MouseEvent<SVGSVGElement, MouseEvent>,
  ) => {
    e && e.stopPropagation();
    if (selectedLayer?.id === layer.id && type === 'DELETE') return;
    let newVisibleLayers: LayerType[] = [];

    if (type === 'ADD') newVisibleLayers = [...visibleLayers, layer];
    if (type === 'DELETE') newVisibleLayers = [...visibleLayers.filter(item => item.id !== layer.id)];

    setVisibleLayers(newVisibleLayers);
  };

  const handleChooseLayer = () => {
    setSelectedLayer(layer);
    setIsVisibleGeneratedLayer(false);
    if (layer && !visibleLayers.includes(layer)) {
      handleChangeVisibleLayers(layer, 'ADD');
    }

    if (image.url !== selectedImage?.url) {
      setSelectedImage(image);
      setVisibleLayers(image.layers);
      setIsVisibleGeneratedLayer(false);
    }
  };

  if (!layer) {
    return (
      <div
        className={cn('image-item__generated__item', {
          active: !selectedLayer && selectedImage?.id === image.id,
        })}
        onClick={() => {
          setVisibleLayers([]);
          setSelectedLayer(null);
          setIsVisibleGeneratedLayer(true);
          selectedImage?.id !== image.id && setSelectedImage(image);
        }}>
        <span className='image-item__generated__item__name'>Найденные объекты</span>
      </div>
    );
  }

  return (
    <div
      className={cn('image-item__layers__item', {
        active: selectedLayer?.id === layer.id,
      })}
      onClick={handleChooseLayer}>
      <div className='image-item__layers__item__name'>
        <span className='image-item__layers__item__number'>#{layer.id}</span>
        <span className='image-item__layers__item__title'>{layer.name}</span>
      </div>
      {isVisibleLayer ? (
        <IconEye
          className={cn('image-item__layers__item__eye', {
            disabled: selectedLayer?.id === layer.id,
          })}
          width={20}
          height={20}
          stroke={1.5}
          onClick={e => handleChangeVisibleLayers(layer, 'DELETE', e)}
        />
      ) : (
        <IconEyeOff
          width={20}
          height={20}
          stroke={1.5}
          onClick={e => handleChangeVisibleLayers(layer, 'ADD', e)}
        />
      )}
    </div>
  );
};
