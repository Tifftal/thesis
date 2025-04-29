/* eslint-disable no-mixed-operators */
import React, { useEffect, useState } from 'react';

import { Layer, Line, Circle } from 'react-konva';

import useStore from 'services/zustand/store';
import { Point, Polygon, ZustandStoreStateType } from 'services/zustand/types';

type Props = {
  scale: number;
  imagePosition: { x: number; y: number };
  handleRightClick: (e: any, type: string, currentObject?: any) => void;
  currentPolygon: Point[];
};

export const PolygonLayer = (props: Props) => {
  const { scale, imagePosition, handleRightClick, currentPolygon } = props;

  const { visibleLayers, selectedLayer } = useStore((state: ZustandStoreStateType) => state);

  const [disabledPolygons, setDisabledPolygons] = useState<Polygon[]>([]);

  useEffect(() => {
    const disabledLayers = visibleLayers.filter(layer => layer.id !== selectedLayer?.id);
    const allPolygons = disabledLayers.flatMap(layer => layer.measurements?.polygons || []);
    setDisabledPolygons(allPolygons);
  }, [visibleLayers, selectedLayer]);

  const renderPolygon = (points: Point[], color: string, isActive: boolean) => {
    const flatPoints = points.flatMap(point => [
      point.x * scale + imagePosition.x,
      point.y * scale + imagePosition.y,
    ]);

    return (
      <>
        <Line
          points={flatPoints}
          stroke={color}
          strokeWidth={2}
          closed={true}
          fill={`${color}80`}
          onContextMenu={isActive ? e => handleRightClick(e, 'POLYGON', points) : undefined}
        />
        {points.map((point, index) => (
          <Circle
            key={`polygon-point-${index}`}
            x={point.x * scale + imagePosition.x}
            y={point.y * scale + imagePosition.y}
            radius={4}
            fill={color}
            onContextMenu={isActive ? e => handleRightClick(e, 'POLYGON', points) : undefined}
          />
        ))}
      </>
    );
  };

  return (
    <Layer>
      {disabledPolygons.map((polygon, index) => (
        <React.Fragment key={`polygon-${index}`}>{renderPolygon(polygon, '#e85050', false)}</React.Fragment>
      ))}

      {(selectedLayer?.measurements?.polygons || []).map((polygon: Polygon, index: number) => (
        <React.Fragment key={`polygon-${index}`}>{renderPolygon(polygon, '#ff0000', true)}</React.Fragment>
      ))}

      {currentPolygon.length > 0 && (
        <>
          {renderPolygon(currentPolygon, '#26f704', true)}
          {/* Показываем линию к курсору, если многоугольник не завершен */}
          {/* {!isPolygonComplete && currentPolygon.length > 0 && (
            <Line
              points={[
                currentPolygon[currentPolygon.length - 1].x * scale + imagePosition.x,
                currentPolygon[currentPolygon.length - 1].y * scale + imagePosition.y,
                // Добавьте координаты курсора, если нужно
              ]}
              stroke='blue'
              strokeWidth={1}
              dash={[5, 5]}
            />
          )} */}
        </>
      )}
    </Layer>
  );
};
