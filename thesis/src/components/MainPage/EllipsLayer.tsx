/* eslint-disable no-mixed-operators */
import React, { useState } from 'react';

import { Layer, Ellipse as KonvaEllipse } from 'react-konva';

import useStore from 'services/zustand/store';
import { Ellipse, ZustandStoreStateType } from 'services/zustand/types';

type Props = {
  scale: number;
  imagePosition: { x: number; y: number };
  handleRightClick: (e: any, type: string, currentObject?: any) => void;
  currentEllipse: Ellipse | null;
};

export const EllipseLayer = (props: Props) => {
  const { scale, imagePosition, handleRightClick, currentEllipse } = props;
  const { visibleLayers, selectedLayer } = useStore((state: ZustandStoreStateType) => state);

  const [disabledEllipses, setDisabledEllipses] = useState<Ellipse[]>([]);

  React.useEffect(() => {
    const disabledLayers = visibleLayers.filter(layer => layer.id !== selectedLayer?.id);
    const allEllipses = disabledLayers.flatMap(layer => layer.measurements?.ellipses || []);
    setDisabledEllipses(allEllipses);
  }, [visibleLayers, selectedLayer]);

  const renderEllipses = () => {
    return (
      <>
        {(selectedLayer?.measurements?.ellipses || []).map((ellipse: Ellipse, index: number) => (
          <KonvaEllipse
            key={`ellipse-${index}`}
            x={ellipse.x * scale + imagePosition.x}
            y={ellipse.y * scale + imagePosition.y}
            radiusX={ellipse.radiusX * scale}
            radiusY={ellipse.radiusY * scale}
            fill='rgba(255, 0, 0, 0.6)'
            stroke='rgb(255, 0, 0)'
            strokeWidth={2}
            onContextMenu={e => handleRightClick(e, 'ELLIPSE', ellipse)}
          />
        ))}

        {disabledEllipses.map((ellipse, index) => (
          <KonvaEllipse
            key={`disabled-ellipse-${index}`}
            x={ellipse.x * scale + imagePosition.x}
            y={ellipse.y * scale + imagePosition.y}
            radiusX={ellipse.radiusX * scale}
            radiusY={ellipse.radiusY * scale}
            fill='rgba(255, 0, 0, 0.3)'
            stroke='rgba(255, 0, 0, 0.5)'
            strokeWidth={2}
          />
        ))}

        {/* Рендер текущего создаваемого эллипса */}
        {currentEllipse && (
          <>
            <KonvaEllipse
              x={currentEllipse.x * scale + imagePosition.x}
              y={currentEllipse.y * scale + imagePosition.y}
              radiusX={currentEllipse.radiusX * scale}
              radiusY={currentEllipse.radiusY * scale}
              stroke='rgb(0, 255, 0)'
              fill='rgba(0, 255, 0, 0.4)'
              strokeWidth={2}
              dash={[5, 5]}
            />
            <KonvaEllipse
              x={currentEllipse.x * scale + imagePosition.x}
              y={currentEllipse.y * scale + imagePosition.y}
              radiusX={4 / scale}
              radiusY={4 / scale}
              fill='rgb(0, 255, 0)'
            />
          </>
        )}
      </>
    );
  };

  return <Layer>{renderEllipses()}</Layer>;
};
