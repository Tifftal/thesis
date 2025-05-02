/* eslint-disable no-mixed-operators */
import React, { useEffect, useState } from 'react';

import { Circle, Layer, Line, Text } from 'react-konva';

import useStore from 'services/zustand/store';
import { Line as LineType, Point, ZustandStoreStateType } from 'services/zustand/types';

import { ChangeLayer } from 'pages/changeDataHelpers';

import { calculateDistance } from 'components/MainPage/helpers';

import useToast from 'utils/hooks/useToast';

type Props = {
  scale: number;
  imagePosition: { x: number; y: number };
  handleRightClick: (e: any, type: string, currentObject?: any) => void;
  currentLinePoints: Point[];
};

export const LineLayer = (props: Props) => {
  const { scale, imagePosition, handleRightClick, currentLinePoints } = props;

  const {
    visibleLayers,
    selectedLayer,
    selectedProject,
    setSelectedProject,
    setSelectedLayer,
    setVisibleLayers,
  } = useStore((state: ZustandStoreStateType) => state);

  const { onMessage } = useToast();

  const [disabledLines, setDisabledLines] = useState<LineType[]>([]);
  const [selectedLineIndex, setSelectedLineIndex] = useState<number | null>(null);
  const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(null);
  const [tempLines, setTempLines] = useState<LineType[]>([]); //нужно для редактирования линии в реальном времени

  useEffect(() => {
    if (selectedLayer?.measurements?.lines) {
      setTempLines([...selectedLayer.measurements.lines]);
    }
  }, [selectedLayer]);

  useEffect(() => {
    const disabledLayers = visibleLayers.filter(layer => layer.id !== selectedLayer?.id);
    const allLines = disabledLayers.flatMap(layer => {
      if (layer.measurements?.lines) return layer.measurements.lines;
      return [];
    });
    setDisabledLines(allLines);
  }, [visibleLayers, selectedLayer]);

  const handlePointDragMove = (e: any) => {
    if (selectedLineIndex === null || selectedPointIndex === null) return;

    const stage = e.target.getStage();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const x = (pointer.x - imagePosition.x) / scale;
    const y = (pointer.y - imagePosition.y) / scale;

    const updatedLines = [...tempLines];
    updatedLines[selectedLineIndex][selectedPointIndex] = { x, y };
    setTempLines(updatedLines);
  };

  const handlePointDragStart = (lineIndex: number, pointIndex: number) => {
    setSelectedLineIndex(lineIndex);
    setSelectedPointIndex(pointIndex);
  };

  const handlePointDragEnd = () => {
    if (
      selectedLineIndex === null ||
      selectedPointIndex === null ||
      !selectedLayer ||
      !selectedLayer.measurements?.lines
    ) {
      return;
    }

    const newMeasurements = JSON.parse(JSON.stringify(selectedLayer?.measurements || {}));

    if (!newMeasurements.lines) {
      newMeasurements.lines = [];
    }

    newMeasurements.lines = tempLines;

    ChangeLayer(
      selectedProject,
      setSelectedProject,
      selectedLayer,
      setSelectedLayer,
      visibleLayers,
      setVisibleLayers,
      newMeasurements,
      onMessage,
      'Ошибка редактирования линии',
    );

    setSelectedLineIndex(null);
    setSelectedPointIndex(null);
  };

  const renderLines = () => {
    const linesToRender = selectedLineIndex !== null ? tempLines : selectedLayer?.measurements?.lines || [];

    return (
      <>
        {linesToRender.map((line: LineType, lineIndex: number) => {
          const [start, end] = line;
          const distance = calculateDistance(start, end);

          return (
            <React.Fragment key={`line-${lineIndex}`}>
              <Line
                points={[
                  start.x * scale + imagePosition.x,
                  start.y * scale + imagePosition.y,
                  end.x * scale + imagePosition.x,
                  end.y * scale + imagePosition.y,
                ]}
                stroke='red'
                strokeWidth={2}
              />

              <Circle
                x={start.x * scale + imagePosition.x}
                y={start.y * scale + imagePosition.y}
                radius={4}
                fill='red'
                draggable
                onDragStart={() => handlePointDragStart(lineIndex, 0)}
                onDragMove={handlePointDragMove}
                onDragEnd={handlePointDragEnd}
              />

              <Circle
                x={end.x * scale + imagePosition.x}
                y={end.y * scale + imagePosition.y}
                radius={4}
                fill='red'
                draggable
                onDragStart={() => handlePointDragStart(lineIndex, 1)}
                onDragMove={handlePointDragMove}
                onDragEnd={handlePointDragEnd}
              />

              <Text
                x={((start.x + end.x) / 2) * scale + imagePosition.x}
                y={((start.y + end.y) / 2) * scale + imagePosition.y - 20}
                text={`${distance} px`}
                fontSize={16}
                fill='red'
                onContextMenu={e => handleRightClick(e, 'LINE', line)}
              />
            </React.Fragment>
          );
        })}

        {disabledLines.map((line, index) => {
          const [start, end] = line;
          const distance = calculateDistance(start, end);

          return (
            <React.Fragment key={`disabled-line-${index}`}>
              <Line
                points={[
                  start.x * scale + imagePosition.x,
                  start.y * scale + imagePosition.y,
                  end.x * scale + imagePosition.x,
                  end.y * scale + imagePosition.y,
                ]}
                stroke='#ff000099'
                strokeWidth={2}
              />
              <Circle
                x={start.x * scale + imagePosition.x}
                y={start.y * scale + imagePosition.y}
                radius={4}
                fill='#ff000099'
              />
              <Circle
                x={end.x * scale + imagePosition.x}
                y={end.y * scale + imagePosition.y}
                radius={4}
                fill='#ff000099'
              />
              <Text
                x={((start.x + end.x) / 2) * scale + imagePosition.x}
                y={((start.y + end.y) / 2) * scale + imagePosition.y - 20}
                text={`${distance} px`}
                fontSize={16}
                fill='#ff000099'
              />
            </React.Fragment>
          );
        })}

        {currentLinePoints.length > 0 && (
          <>
            <Circle
              x={currentLinePoints[0].x * scale + imagePosition.x}
              y={currentLinePoints[0].y * scale + imagePosition.y}
              radius={4}
              fill='red'
            />
            {currentLinePoints.length === 1 && (
              <Line
                points={[
                  currentLinePoints[0].x * scale + imagePosition.x,
                  currentLinePoints[0].y * scale + imagePosition.y,
                  (currentLinePoints[0].x + 1) * scale + imagePosition.x,
                  (currentLinePoints[0].y + 1) * scale + imagePosition.y,
                ]}
                stroke='red'
                strokeWidth={2}
                dash={[5, 5]}
              />
            )}
          </>
        )}
      </>
    );
  };

  return <Layer>{renderLines()}</Layer>;
};
