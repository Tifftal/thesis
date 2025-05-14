/* eslint-disable no-mixed-operators */
import React, { useEffect, useState } from 'react';

import { Circle, Layer, Line, Text } from 'react-konva';

import useStore from 'services/zustand/store';
import { BrokenLine, Point, ZustandStoreStateType } from 'services/zustand/types';

import { calculateDistance } from 'components/MainPage/helpers';
import { ChangeLayer, getScaledPosition } from 'pages/helpers';

import useToast from 'utils/hooks/useToast';

type Props = {
  scale: number;
  imagePosition: { x: number; y: number };
  handleRightClick: (e: any, type: string, currentObject?: any) => void;
  currentBrokenLine: Point[];
};

export const BrokenLineLayer = (props: Props) => {
  const { scale, imagePosition, handleRightClick, currentBrokenLine } = props;

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

  const [disabledBrokenLines, setDisabledBrokenLines] = useState<BrokenLine[]>([]);
  const [selectedLineIndex, setSelectedLineIndex] = useState<number | null>(null);
  const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(null);
  const [tempLines, setTempLines] = useState<BrokenLine[]>([]); //нужно для редактирования линии в реальном времени
  const [isDraggingAll, setIsDraggingAll] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [primaryColor, setPrimaryColor] = useState<string>(
    selectedLayer?.color ? `#${selectedLayer?.color}` : '#a0f600',
  );

  useEffect(() => {
    const disabledLayers = visibleLayers.filter(layer => layer.id !== selectedLayer?.id);
    const allLines = disabledLayers.flatMap(layer => layer.measurements?.brokenLines || []);
    setDisabledBrokenLines(allLines);
  }, [visibleLayers, selectedLayer]);

  useEffect(() => {
    if (selectedLayer?.measurements?.brokenLines) {
      setTempLines([...selectedLayer.measurements.brokenLines]);
    }
    setPrimaryColor(selectedLayer?.color ? `#${selectedLayer?.color}` : '#a0f600');
  }, [selectedLayer]);

  const handleTextDragStart = (e: any, lineIndex: number) => {
    e.cancelBubble = true;
    setSelectedLineIndex(lineIndex);
    setIsDraggingAll(true);

    const stage = e.target.getStage();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    // Вычисляем центр ломаной линии
    const line = tempLines[lineIndex];
    const center = line.reduce(
      (acc, point) => {
        return {
          x: acc.x + point.x,
          y: acc.y + point.y,
        };
      },
      { x: 0, y: 0 },
    );

    center.x /= line.length;
    center.y /= line.length;

    const { x, y } = getScaledPosition(pointer, imagePosition, stagePosition, scale);

    setDragOffset({
      x: x - center.x,
      y: y - center.y,
    });
  };

  const handleTextDragMove = (e: any) => {
    e.cancelBubble = true;
    if (selectedLineIndex === null || !isDraggingAll) return;

    const stage = e.target.getStage();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const cursorPoint = getScaledPosition(pointer, imagePosition, stagePosition, scale);

    const x = cursorPoint.x - dragOffset.x;
    const y = cursorPoint.y - dragOffset.y;

    const line = tempLines[selectedLineIndex];

    // Вычисляем текущий центр
    const currentCenter = line.reduce(
      (acc, point) => {
        return {
          x: acc.x + point.x,
          y: acc.y + point.y,
        };
      },
      { x: 0, y: 0 },
    );

    currentCenter.x /= line.length;
    currentCenter.y /= line.length;

    // Вычисляем смещение
    const offsetX = x - currentCenter.x;
    const offsetY = y - currentCenter.y;

    // Перемещаем все точки
    const updatedLines = [...tempLines];
    updatedLines[selectedLineIndex] = line.map(point => ({
      x: point.x + offsetX,
      y: point.y + offsetY,
    }));

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

    if (!selectedLayer || !selectedLayer.measurements?.brokenLines) {
      return;
    }

    const newMeasurements = JSON.parse(JSON.stringify(selectedLayer?.measurements || {}));

    if (!newMeasurements.brokenLines) {
      newMeasurements.brokenLines = [];
    }

    newMeasurements.brokenLines = tempLines;

    ChangeLayer(
      selectedProject,
      setSelectedProject,
      selectedLayer,
      setSelectedLayer,
      visibleLayers,
      setVisibleLayers,
      newMeasurements,
      onMessage,
      'Ошибка редактирования ломаной',
      () => {
        setIsDraggingAll(false);
        setSelectedLineIndex(null);
        setSelectedPointIndex(null);
      },
    );
  };

  const getDistance = (point1: Point, point2: Point) => {
    return calculateDistance(point1, point2, scaleFactor, selectedImage?.units);
  };

  const renderBrokenLines = () => {
    const linesToRender =
      selectedLineIndex !== null ? tempLines : selectedLayer?.measurements?.brokenLines || [];

    return (
      <>
        {linesToRender.map((line: Point[], lineIndex: number) => {
          const center = line.reduce(
            (acc, point) => {
              return {
                x: acc.x + point.x,
                y: acc.y + point.y,
              };
            },
            { x: 0, y: 0 },
          );

          center.x /= line.length;
          center.y /= line.length;

          return (
            <React.Fragment key={`broken-line-${lineIndex}`}>
              <Line
                points={line.flatMap(point => [
                  point.x * scale + imagePosition.x,
                  point.y * scale + imagePosition.y,
                ])}
                stroke={primaryColor}
                strokeWidth={2}
              />
              {line.map((point, pointIndex) => (
                <Circle
                  key={`point-${lineIndex}-${pointIndex}`}
                  x={point.x * scale + imagePosition.x}
                  y={point.y * scale + imagePosition.y}
                  radius={4}
                  fill={primaryColor}
                  stroke='#333333'
                  strokeWidth={1}
                  draggable
                  onDragStart={e => handlePointDragStart(e, lineIndex, pointIndex)}
                  onDragMove={handlePointDragMove}
                  onDragEnd={handlePointDragEnd}
                />
              ))}

              {line.length > 1 &&
                Array.from({ length: line.length - 1 }).map((_, segmentIndex) => (
                  <Text
                    key={`segment-label-${lineIndex}-${segmentIndex}`}
                    x={((line[segmentIndex].x + line[segmentIndex + 1].x) / 2) * scale + imagePosition.x}
                    y={((line[segmentIndex].y + line[segmentIndex + 1].y) / 2) * scale + imagePosition.y - 20}
                    text={getDistance(line[segmentIndex], line[segmentIndex + 1])}
                    fontSize={14}
                    fill={primaryColor}
                    draggable
                    onDragStart={e => handleTextDragStart(e, lineIndex)}
                    onDragMove={handleTextDragMove}
                    onDragEnd={handlePointDragEnd}
                    onContextMenu={e => handleRightClick(e, 'BROKEN_LINE', line)}
                  />
                ))}
            </React.Fragment>
          );
        })}

        {disabledBrokenLines.map((line, lineIndex) => (
          <React.Fragment key={`broken-line-${lineIndex}`}>
            <Line
              points={line.flatMap(point => [
                point.x * scale + imagePosition.x,
                point.y * scale + imagePosition.y,
              ])}
              stroke={`${primaryColor}80`}
              strokeWidth={2}
            />
          </React.Fragment>
        ))}

        {currentBrokenLine.length > 0 && (
          <>
            <Line
              points={currentBrokenLine.flatMap(point => [
                point.x * scale + imagePosition.x,
                point.y * scale + imagePosition.y,
              ])}
              stroke={primaryColor}
              strokeWidth={2}
            />
            {currentBrokenLine.map((point, index) => (
              <Circle
                key={`current-point-${index}`}
                x={point.x * scale + imagePosition.x}
                y={point.y * scale + imagePosition.y}
                radius={4}
                fill={primaryColor}
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
                  text={getDistance(currentBrokenLine[segmentIndex], currentBrokenLine[segmentIndex + 1])}
                  fontSize={14}
                  fill={primaryColor}
                />
              ))}
          </>
        )}
      </>
    );
  };

  return <Layer>{renderBrokenLines()}</Layer>;
};
