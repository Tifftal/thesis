/* eslint-disable no-mixed-operators */
import React from 'react';

import { Layer, Line, Circle } from 'react-konva';

import useStore from 'services/zustand/store';
import { Point, ZustandStoreStateType } from 'services/zustand/types';

type Props = {
  scale: number;
  imagePosition: { x: number; y: number };
  currentPolygon: Point[];
  isPolygonComplete: boolean;
};

export const PolygonLayer = (props: Props) => {
  const { scale, imagePosition, currentPolygon, isPolygonComplete } = props;

  const { polygons } = useStore((state: ZustandStoreStateType) => state);

  const renderPolygon = (points: Point[], color: string) => {
    const flatPoints = points.flatMap(point => [
      point.x * scale + imagePosition.x,
      point.y * scale + imagePosition.y,
    ]);

    return (
      <>
        <Line points={flatPoints} stroke={color} strokeWidth={2} closed={true} fill={`${color}80`} />
        {points.map((point, index) => (
          <Circle
            key={`polygon-point-${index}`}
            x={point.x * scale + imagePosition.x}
            y={point.y * scale + imagePosition.y}
            radius={4}
            fill={color}
          />
        ))}
      </>
    );
  };

  return (
    <Layer>
      {polygons.map((polygon, index) => (
        <React.Fragment key={`polygon-${index}`}>{renderPolygon(polygon, '#ee4d23')}</React.Fragment>
      ))}

      {currentPolygon.length > 0 && (
        <>
          {renderPolygon(currentPolygon, '#26f704')}
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
