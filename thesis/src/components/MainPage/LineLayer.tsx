/* eslint-disable no-mixed-operators */
import React, { useEffect, useState } from 'react';

import { Circle, Layer, Line, Text } from 'react-konva';

import useStore from 'services/zustand/store';
import { Line as LineType, Point, ZustandStoreStateType } from 'services/zustand/types';

import { calculateDistance } from 'components/MainPage/helpers';

type Props = {
  scale: number;
  imagePosition: { x: number; y: number };
  handleRightClick: (e: any, type: string, currentObject?: any) => void;
  currentLinePoints: Point[];
};

export const LineLayer = (props: Props) => {
  const { scale, imagePosition, handleRightClick, currentLinePoints } = props;

  const { visibleLayers, selectedLayer } = useStore((state: ZustandStoreStateType) => state);

  const [disabledLines, setDisabledLines] = useState<LineType[]>([]);

  useEffect(() => {
    const disabledLayers = visibleLayers.filter(layer => layer.id !== selectedLayer?.id);
    const allLines = disabledLayers.flatMap(layer => layer.measurements?.lines || []);
    setDisabledLines(allLines);
  }, [visibleLayers, selectedLayer]);

  const renderLines = () => {
    return (
      <>
        {(selectedLayer?.measurements?.lines || []).map((line: Point[], index: any) => (
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

        {disabledLines.map((line, index) => (
          <React.Fragment key={`line-${index}`}>
            {line.map((point, circleIndex) => (
              <Circle
                key={`circle-${circleIndex}`}
                x={point.x * scale + imagePosition.x}
                y={point.y * scale + imagePosition.y}
                radius={4}
                fill='#ff000099'
              />
            ))}
            <Circle
              x={line[0].x * scale + imagePosition.x}
              y={line[0].y * scale + imagePosition.y}
              radius={4}
              fill='#ff000099'
            />
            <Line
              points={[
                line[0].x * scale + imagePosition.x,
                line[0].y * scale + imagePosition.y,
                line[1].x * scale + imagePosition.x,
                line[1].y * scale + imagePosition.y,
              ]}
              stroke='#ff000099'
              strokeWidth={2}
            />
            <Text
              x={((line[0].x + line[1].x) / 2) * scale + imagePosition.x}
              y={((line[0].y + line[1].y) / 2) * scale + imagePosition.y - 20}
              text={`${calculateDistance(line[0], line[1])} px`}
              fontSize={16}
              fill='#ff000099'
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
