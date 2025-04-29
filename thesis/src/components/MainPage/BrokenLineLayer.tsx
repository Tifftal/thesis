/* eslint-disable no-mixed-operators */
import React, { useEffect, useState } from 'react';

import { Circle, Layer, Line, Text } from 'react-konva';

import useStore from 'services/zustand/store';
import { BrokenLine, Point, ZustandStoreStateType } from 'services/zustand/types';

import { calculateDistance } from 'pages/MainPage/helpers';

type Props = {
  scale: number;
  imagePosition: { x: number; y: number };
  handleRightClick: (e: any, type: string, currentObject?: any) => void;
  currentBrokenLine: Point[];
};

export const BrokenLineLayer = (props: Props) => {
  const { scale, imagePosition, handleRightClick, currentBrokenLine } = props;

  const { visibleLayers, selectedLayer } = useStore((state: ZustandStoreStateType) => state);

  const [disabledBrokenLines, setDisabledBrokenLines] = useState<BrokenLine[]>([]);

  useEffect(() => {
    const disabledLayers = visibleLayers.filter(layer => layer.id !== selectedLayer?.id);
    const allLines = disabledLayers.flatMap(layer => layer.measurements?.brokenLines || []);
    setDisabledBrokenLines(allLines);
  }, [visibleLayers, selectedLayer]);

  const renderBrokenLines = () => {
    return (
      <>
        {(selectedLayer?.measurements?.brokenLines || []).map((line: Point[], lineIndex: number) => (
          <React.Fragment key={`broken-line-${lineIndex}`}>
            <Line
              points={line.flatMap(point => [
                point.x * scale + imagePosition.x,
                point.y * scale + imagePosition.y,
              ])}
              stroke='red'
              strokeWidth={2}
            />
            {line.map((point, pointIndex) => (
              <Circle
                key={`point-${lineIndex}-${pointIndex}`}
                x={point.x * scale + imagePosition.x}
                y={point.y * scale + imagePosition.y}
                radius={4}
                fill='red'
              />
            ))}

            {line.length > 1 &&
              Array.from({ length: line.length - 1 }).map((_, segmentIndex) => (
                <Text
                  key={`segment-label-${lineIndex}-${segmentIndex}`}
                  x={((line[segmentIndex].x + line[segmentIndex + 1].x) / 2) * scale + imagePosition.x}
                  y={((line[segmentIndex].y + line[segmentIndex + 1].y) / 2) * scale + imagePosition.y - 20}
                  text={`${calculateDistance(line[segmentIndex], line[segmentIndex + 1])} px`}
                  fontSize={16}
                  fill='red'
                  onContextMenu={e => handleRightClick(e, 'BROKEN_LINE', line)}
                />
              ))}
          </React.Fragment>
        ))}

        {disabledBrokenLines.map((line, lineIndex) => (
          <React.Fragment key={`broken-line-${lineIndex}`}>
            <Line
              points={line.flatMap(point => [
                point.x * scale + imagePosition.x,
                point.y * scale + imagePosition.y,
              ])}
              stroke='#ff000099'
              strokeWidth={2}
            />
            {line.map((point, pointIndex) => (
              <Circle
                key={`point-${lineIndex}-${pointIndex}`}
                x={point.x * scale + imagePosition.x}
                y={point.y * scale + imagePosition.y}
                radius={4}
                fill='#ff000099'
              />
            ))}

            {line.length > 1 &&
              Array.from({ length: line.length - 1 }).map((_, segmentIndex) => (
                <Text
                  key={`segment-label-${lineIndex}-${segmentIndex}`}
                  x={((line[segmentIndex].x + line[segmentIndex + 1].x) / 2) * scale + imagePosition.x}
                  y={((line[segmentIndex].y + line[segmentIndex + 1].y) / 2) * scale + imagePosition.y - 20}
                  text={`${calculateDistance(line[segmentIndex], line[segmentIndex + 1])} px`}
                  fontSize={16}
                  fill='#ff000099'
                />
              ))}
          </React.Fragment>
        ))}

        {currentBrokenLine.length > 0 && (
          <>
            <Line
              points={currentBrokenLine.flatMap(point => [
                point.x * scale + imagePosition.x,
                point.y * scale + imagePosition.y,
              ])}
              stroke='red'
              strokeWidth={2}
            />
            {currentBrokenLine.map((point, index) => (
              <Circle
                key={`current-point-${index}`}
                x={point.x * scale + imagePosition.x}
                y={point.y * scale + imagePosition.y}
                radius={4}
                fill='red'
              />
            ))}

            {currentBrokenLine.length > 1 &&
              Array.from({ length: currentBrokenLine.length - 1 }).map((_, segmentIndex) => (
                <Text
                  key={`current-segment-label-${segmentIndex}`}
                  x={
                    ((currentBrokenLine[segmentIndex].x + currentBrokenLine[segmentIndex + 1].x) / 2) *
                      scale +
                    imagePosition.x
                  }
                  y={
                    ((currentBrokenLine[segmentIndex].y + currentBrokenLine[segmentIndex + 1].y) / 2) *
                      scale +
                    imagePosition.y -
                    20
                  }
                  text={`${calculateDistance(
                    currentBrokenLine[segmentIndex],
                    currentBrokenLine[segmentIndex + 1],
                  )} px`}
                  fontSize={16}
                  fill='red'
                />
              ))}
          </>
        )}
      </>
    );
  };

  return <Layer>{renderBrokenLines()}</Layer>;
};
