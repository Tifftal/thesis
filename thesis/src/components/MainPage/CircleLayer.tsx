/* eslint-disable no-mixed-operators */
import React, { useEffect, useState } from 'react';

import { Circle, Layer } from 'react-konva';

import useStore from 'services/zustand/store';
import { Circle as CircleType, ZustandStoreStateType } from 'services/zustand/types';

type Props = {
  scale: number;
  imagePosition: { x: number; y: number };
  handleRightClick: (e: any, type: string, currentObject?: any) => void;
  currentCircle: CircleType | null;
};

export const CircleLayer = (props: Props) => {
  const { scale, imagePosition, handleRightClick, currentCircle } = props;

  const { visibleLayers, selectedLayer } = useStore((state: ZustandStoreStateType) => state);

  const [disabledCircles, setDisabledCircles] = useState<CircleType[]>([]);

  useEffect(() => {
    const disabledLayers = visibleLayers.filter(layer => layer.id !== selectedLayer?.id);
    const allCircles = disabledLayers.flatMap(layer => layer.measurements?.circles || []);
    setDisabledCircles(allCircles);
  }, [visibleLayers, selectedLayer]);

  const renderCircles = () => {
    return (
      <>
        {(selectedLayer?.measurements?.circles || []).map((circle: CircleType, index: number) => (
          <React.Fragment key={`circle-${index}`}>
            <Circle
              x={circle.x * scale + imagePosition.x}
              y={circle.y * scale + imagePosition.y}
              radius={circle.radius * scale}
              fill='rgba(255, 0, 0, 0.6)'
              stroke='rgb(255, 0, 0)'
              strokeWidth={2}
              onContextMenu={e => handleRightClick(e, 'CIRCLE', circle)}
            />
          </React.Fragment>
        ))}

        {disabledCircles.map((circle, index) => (
          <React.Fragment key={`disabled-circle-${index}`}>
            <Circle
              x={circle.x * scale + imagePosition.x}
              y={circle.y * scale + imagePosition.y}
              radius={circle.radius * scale}
              fill='rgba(255, 0, 0, 0.3)'
              stroke='rgba(255, 0, 0, 0.5)'
              strokeWidth={2}
            />
          </React.Fragment>
        ))}

        {/* Рендер текущего создаваемого круга */}
        {currentCircle && (
          <>
            <Circle
              x={currentCircle.x * scale + imagePosition.x}
              y={currentCircle.y * scale + imagePosition.y}
              radius={4}
              fill='rgb(0, 255, 0)'
            />
            <Circle
              x={currentCircle.x * scale + imagePosition.x}
              y={currentCircle.y * scale + imagePosition.y}
              radius={currentCircle.radius * scale}
              stroke='rgb(0, 255, 0)'
              fill='rgba(0, 255, 0, 0.4)'
              strokeWidth={2}
              dash={[5, 5]}
            />
          </>
        )}
      </>
    );
  };

  return <Layer>{renderCircles()}</Layer>;
};
