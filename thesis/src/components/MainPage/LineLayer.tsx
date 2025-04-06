/* eslint-disable no-mixed-operators */
import React from 'react';

import { Circle, Layer, Line, Text } from 'react-konva';

import useStore from 'services/zustand/store';
import { Point, ZustandStoreStateType } from 'services/zustand/types';

import { calculateDistance } from 'pages/MainPage/helpers';

type Props = {
  scale: number;
  imagePosition: { x: number; y: number };
  handleRightClick: (e: any, type: string, currentObject?: any) => void;
  currentLinePoints: Point[];
};

export const LineLayer = (props: Props) => {
  const { scale, imagePosition, handleRightClick, currentLinePoints } = props;

  const { lines } = useStore((state: ZustandStoreStateType) => state);

  const renderLines = () => {
    return (
      <>
        {/* Рендер всех сохраненных линий */}
        {lines.map((line, index) => (
          <React.Fragment key={`line-${index}`}>
            {line.map((point, circleIndex) => (
              <Circle
                key={`circle-${circleIndex}`}
                x={point.x * scale + imagePosition.x}
                y={point.y * scale + imagePosition.y}
                radius={4}
                fill='red'
              />
            ))}
            <Circle
              x={line[0].x * scale + imagePosition.x}
              y={line[0].y * scale + imagePosition.y}
              radius={4}
              fill='red'
            />
            <Line
              points={[
                line[0].x * scale + imagePosition.x,
                line[0].y * scale + imagePosition.y,
                line[1].x * scale + imagePosition.x,
                line[1].y * scale + imagePosition.y,
              ]}
              stroke='red'
              strokeWidth={2}
            />
            <Text
              x={((line[0].x + line[1].x) / 2) * scale + imagePosition.x}
              y={((line[0].y + line[1].y) / 2) * scale + imagePosition.y - 20}
              text={`${calculateDistance(line[0], line[1])} px`}
              fontSize={16}
              fill='red'
              onContextMenu={e => handleRightClick(e, 'LINE', line)}
            />
          </React.Fragment>
        ))}

        {/* Рендер текущей создаваемой линии (1 точка) */}
        {currentLinePoints.length > 0 && (
          <>
            <Circle
              x={currentLinePoints[0].x * scale + imagePosition.x}
              y={currentLinePoints[0].y * scale + imagePosition.y}
              radius={4}
              fill='red'
            />
          </>
        )}
      </>
    );
  };

  return <Layer>{renderLines()}</Layer>;
};
