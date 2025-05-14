/* eslint-disable no-mixed-operators */
import React, { useEffect, useState } from 'react';

import { Circle, Layer, Line, Text } from 'react-konva';

import useStore from 'services/zustand/store';
import { Line as LineType, Point, ZustandStoreStateType } from 'services/zustand/types';

import { calculateDistance } from 'components/MainPage/helpers';
import { ChangeLayer, getScaledPosition } from 'pages/helpers';

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
    stagePosition,
    selectedImage,
    scaleFactor,
  } = useStore((state: ZustandStoreStateType) => state);

  const { onMessage } = useToast();

  const [disabledLines, setDisabledLines] = useState<LineType[]>([]);
  const [selectedLineIndex, setSelectedLineIndex] = useState<number | null>(null);
  const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(null);
  const [tempLines, setTempLines] = useState<LineType[]>([]); //нужно для редактирования линии в реальном времени
  const [isDraggingLine, setIsDraggingLine] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [primaryColor, setPrimaryColor] = useState<string>(
    selectedLayer?.color ? `#${selectedLayer?.color}` : '#a0f600',
  );

  useEffect(() => {
    if (selectedLayer?.measurements?.lines) {
      setTempLines([...selectedLayer.measurements.lines]);
    }
    setPrimaryColor(selectedLayer?.color ? `#${selectedLayer?.color}` : '#a0f600');
  }, [selectedLayer]);

  useEffect(() => {
    const disabledLayers = visibleLayers.filter(layer => layer.id !== selectedLayer?.id);
    const allLines = disabledLayers.flatMap(layer => {
      if (layer.measurements?.lines) return layer.measurements.lines;
      return [];
    });
    setDisabledLines(allLines);
  }, [visibleLayers, selectedLayer]);

  const handleLineDragStart = (e: any, lineIndex: number) => {
    e.cancelBubble = true;
    setSelectedLineIndex(lineIndex);
    setIsDraggingLine(true);

    const stage = e.target.getStage();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const line = tempLines[lineIndex];
    const center = {
      x: (line[0].x + line[1].x) / 2,
      y: (line[0].y + line[1].y) / 2,
    };

    const { x, y } = getScaledPosition(pointer, imagePosition, stagePosition, scale);

    setDragOffset({
      x: x - center.x,
      y: y - center.y,
    });
  };

  const handleLineDragMove = (e: any) => {
    e.cancelBubble = true;
    if (selectedLineIndex === null || !isDraggingLine) return;

    const stage = e.target.getStage();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const cursorPoint = getScaledPosition(pointer, imagePosition, stagePosition, scale);

    const x = cursorPoint.x - dragOffset.x;
    const y = cursorPoint.y - dragOffset.y;

    const line = tempLines[selectedLineIndex];
    const currentCenter = {
      x: (line[0].x + line[1].x) / 2,
      y: (line[0].y + line[1].y) / 2,
    };

    const offsetX = x - currentCenter.x;
    const offsetY = y - currentCenter.y;

    const updatedLines = [...tempLines];
    updatedLines[selectedLineIndex] = [
      {
        x: line[0].x + offsetX,
        y: line[0].y + offsetY,
      },
      {
        x: line[1].x + offsetX,
        y: line[1].y + offsetY,
      },
    ];

    setTempLines(updatedLines);
  };

  const handlePointDragMove = (e: any) => {
    e.cancelBubble = true;
    if (selectedLineIndex === null || selectedPointIndex === null) return;

    const stage = e.target.getStage();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const { x, y } = getScaledPosition(pointer, imagePosition, stagePosition, scale);

    const updatedLines = [...tempLines];
    updatedLines[selectedLineIndex][selectedPointIndex] = { x, y };
    setTempLines(updatedLines);
  };

  const handlePointDragStart = (e: any, lineIndex: number, pointIndex: number) => {
    e.cancelBubble = true;
    setSelectedLineIndex(lineIndex);
    setSelectedPointIndex(pointIndex);
  };

  const handlePointDragEnd = (e: any) => {
    e.cancelBubble = true;

    if (!selectedLayer || !selectedLayer.measurements?.lines) {
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
      () => {
        setSelectedLineIndex(null);
        setSelectedPointIndex(null);
        setIsDraggingLine(false);
      },
    );
  };

  const renderLines = () => {
    const linesToRender = selectedLineIndex !== null ? tempLines : selectedLayer?.measurements?.lines || [];

    return (
      <>
        {linesToRender.map((line: LineType, lineIndex: number) => {
          const [start, end] = line;
          const distance = calculateDistance(start, end, scaleFactor, selectedImage?.units) || '';
          const centerX = (start.x + end.x) / 2;
          const centerY = (start.y + end.y) / 2;

          return (
            <React.Fragment key={`line-${lineIndex}`}>
              <Line
                points={[
                  start.x * scale + imagePosition.x,
                  start.y * scale + imagePosition.y,
                  end.x * scale + imagePosition.x,
                  end.y * scale + imagePosition.y,
                ]}
                stroke={primaryColor}
                strokeWidth={2}
                draggable
              />

              <Circle
                x={start.x * scale + imagePosition.x}
                y={start.y * scale + imagePosition.y}
                radius={4}
                fill={primaryColor}
                stroke='#333333'
                strokeWidth={1}
                draggable
                onDragStart={e => handlePointDragStart(e, lineIndex, 0)}
                onDragMove={handlePointDragMove}
                onDragEnd={handlePointDragEnd}
              />

              <Circle
                x={end.x * scale + imagePosition.x}
                y={end.y * scale + imagePosition.y}
                radius={4}
                fill={primaryColor}
                stroke='#333333'
                strokeWidth={1}
                draggable
                onDragStart={e => handlePointDragStart(e, lineIndex, 1)}
                onDragMove={handlePointDragMove}
                onDragEnd={handlePointDragEnd}
              />

              <Text
                x={centerX * scale + imagePosition.x}
                y={centerY * scale + imagePosition.y - 20}
                text={distance}
                fontSize={14}
                fill={primaryColor}
                draggable
                onDragStart={e => handleLineDragStart(e, lineIndex)}
                onDragMove={handleLineDragMove}
                onDragEnd={handlePointDragEnd}
                onContextMenu={e => handleRightClick(e, 'LINE', line)}
              />
            </React.Fragment>
          );
        })}

        {disabledLines.map((line, index) => {
          const [start, end] = line;

          return (
            <React.Fragment key={`disabled-line-${index}`}>
              <Line
                points={[
                  start.x * scale + imagePosition.x,
                  start.y * scale + imagePosition.y,
                  end.x * scale + imagePosition.x,
                  end.y * scale + imagePosition.y,
                ]}
                stroke={`${primaryColor}80`}
                strokeWidth={2}
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
              fill={primaryColor}
            />
            {currentLinePoints.length === 1 && (
              <Line
                points={[
                  currentLinePoints[0].x * scale + imagePosition.x,
                  currentLinePoints[0].y * scale + imagePosition.y,
                  (currentLinePoints[0].x + 1) * scale + imagePosition.x,
                  (currentLinePoints[0].y + 1) * scale + imagePosition.y,
                ]}
                stroke={primaryColor}
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
