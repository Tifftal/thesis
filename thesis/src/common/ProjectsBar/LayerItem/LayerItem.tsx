import { useEffect, useState } from 'react';

import { IconEye, IconEyeOff } from '@tabler/icons-react';
import cn from 'classnames';

import useStore from 'services/zustand/store';
import { LayerType, ZustandStoreStateType } from 'services/zustand/types';

type Props = {
  layer: LayerType;
};

export const LayerItem = (props: Props) => {
  const { layer } = props;

  const { visibleLayers, setVisibleLayers, selectedLayer, setSelectedLayer } = useStore(
    (state: ZustandStoreStateType) => state,
  );

  const [isVisibleLayer, setIsVisibleLayer] = useState<boolean>(
    visibleLayers.some(visibleLayer => visibleLayer.id === layer.id),
  );

  useEffect(() => {
    setIsVisibleLayer(visibleLayers.some(visibleLayer => visibleLayer.id === layer.id));
  }, [visibleLayers]);

  const handleChangeVisibleLayers = (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>,
    layer: LayerType,
    type: 'ADD' | 'DELETE',
  ) => {
    e.stopPropagation();
    if (selectedLayer?.id === layer.id && type === 'DELETE') return;
    let newVisibleLayers: LayerType[] = [];

    if (type === 'ADD') newVisibleLayers = [...visibleLayers, layer];
    if (type === 'DELETE') newVisibleLayers = [...visibleLayers.filter(item => item.id !== layer.id)];

    setVisibleLayers(newVisibleLayers);
  };

  return (
    <div
      className={cn('image-item__layers__item', {
        active: selectedLayer?.id === layer.id,
      })}
      onClick={() => setSelectedLayer(layer)}>
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
          onClick={e => handleChangeVisibleLayers(e, layer, 'DELETE')}
        />
      ) : (
        <IconEyeOff
          width={20}
          height={20}
          stroke={1.5}
          onClick={e => handleChangeVisibleLayers(e, layer, 'ADD')}
        />
      )}
    </div>
  );
};
