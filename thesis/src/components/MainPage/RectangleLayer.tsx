/* eslint-disable no-mixed-operators */
import { useEffect, useState, useCallback } from 'react';

import { Layer, Rect, Group, Circle } from 'react-konva';

import useStore from 'services/zustand/store';
import { Rectangle, ZustandStoreStateType } from 'services/zustand/types';

import { ChangeLayer, getScaledPosition } from 'pages/helpers';

import useToast from 'utils/hooks/useToast';

type Props = {
  scale: number;
  imagePosition: { x: number; y: number };
  handleRightClick: (e: any, type: string, currentObject?: any) => void;
  currentRectangle: Rectangle | null;
};

export const RectangleLayer = ({ scale, imagePosition, currentRectangle, handleRightClick }: Props) => {
  const {
    visibleLayers,
    selectedLayer,
    selectedProject,
    setSelectedProject,
    setSelectedLayer,
    setVisibleLayers,
    stagePosition,
  } = useStore((state: ZustandStoreStateType) => state);

  const { onMessage } = useToast();

  const [disabledRectangles, setDisabledRectangles] = useState<Rectangle[]>([]);
  const [tempRectangles, setTempRectangles] = useState<Rectangle[]>([]);
  const [selectedRectIndex, setSelectedRectIndex] = useState<number | null>(null);
  const [selectedCorner, setSelectedCorner] = useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = useState<string>(
    selectedLayer?.color ? `#${selectedLayer?.color}` : '#a0f600',
  );

  useEffect(() => {
    const disabledLayers = visibleLayers.filter(layer => layer.id !== selectedLayer?.id);
    const allRectangles = disabledLayers.flatMap(layer => layer.measurements?.rectangles || []);
    setDisabledRectangles(allRectangles);
  }, [visibleLayers, selectedLayer]);

  useEffect(() => {
    if (selectedLayer?.measurements?.rectangles) {
      setTempRectangles([...selectedLayer.measurements.rectangles]);
    }
    setPrimaryColor(selectedLayer?.color ? `#${selectedLayer?.color}` : '#a0f600');
  }, [selectedLayer]);

  const handleDragStart = (e: any, index: number) => {
    e.cancelBubble = true;
    setSelectedRectIndex(index);
  };

  const handleDragMove = useCallback(
    (e: any) => {
      e.cancelBubble = true;

      if (selectedRectIndex === null) return;

      const stage = e.target.getStage();
      const pointer = stage.getPointerPosition();
      if (!pointer) return;

      const { x, y } = getScaledPosition(pointer, imagePosition, stagePosition, scale);

      setTempRectangles(prev => {
        const updated = [...prev];
        const rect = updated[selectedRectIndex];

        // Вычисляем смещение от центра
        const offsetX = x - (rect.x + rect.width / 2);
        const offsetY = y - (rect.y + rect.height / 2);

        // Перемещаем весь прямоугольник
        updated[selectedRectIndex] = {
          ...rect,
          x: rect.x + offsetX,
          y: rect.y + offsetY,
        };

        return updated;
      });
    },
    [selectedRectIndex, scale, imagePosition, stagePosition],
  );

  const handleCornerDragStart = (e: any, rectIndex: number, corner: string) => {
    e.cancelBubble = true;
    setSelectedRectIndex(rectIndex);
    setSelectedCorner(corner);
  };

  const handleCornerDragMove = useCallback(
    (e: any) => {
      e.cancelBubble = true;

      if (selectedRectIndex === null || selectedCorner === null) return;

      const stage = e.target.getStage();
      const pointer = stage.getPointerPosition();
      if (!pointer) return;

      const { x, y } = getScaledPosition(pointer, imagePosition, stagePosition, scale);

      setTempRectangles(prev => {
        const updated = [...prev];
        const rect = updated[selectedRectIndex];

        if (selectedCorner === 'top-left') {
          const newWidth = rect.width + (rect.x - x);
          const newHeight = rect.height + (rect.y - y);
          updated[selectedRectIndex] = {
            x: Math.min(x, rect.x + rect.width),
            y: Math.min(y, rect.y + rect.height),
            width: Math.abs(newWidth),
            height: Math.abs(newHeight),
          };
        } else if (selectedCorner === 'top-right') {
          const newHeight = rect.height + (rect.y - y);
          updated[selectedRectIndex] = {
            ...rect,
            y: Math.min(y, rect.y + rect.height),
            width: Math.max(x - rect.x, 1),
            height: Math.abs(newHeight),
          };
        } else if (selectedCorner === 'bottom-left') {
          const newWidth = rect.width + (rect.x - x);
          updated[selectedRectIndex] = {
            ...rect,
            x: Math.min(x, rect.x + rect.width),
            width: Math.abs(newWidth),
            height: Math.max(y - rect.y, 1),
          };
        } else if (selectedCorner === 'bottom-right') {
          updated[selectedRectIndex] = {
            ...rect,
            width: Math.max(x - rect.x, 1),
            height: Math.max(y - rect.y, 1),
          };
        }

        return updated;
      });
    },
    [selectedRectIndex, selectedCorner, scale, imagePosition],
  );

  const handleCornerDragEnd = useCallback(
    (e: any) => {
      e.cancelBubble = true;

      if (selectedRectIndex === null || !selectedLayer) return;

      const newMeasurements = {
        ...selectedLayer.measurements,
        rectangles: tempRectangles,
      };

      ChangeLayer(
        selectedProject,
        setSelectedProject,
        selectedLayer,
        setSelectedLayer,
        visibleLayers,
        setVisibleLayers,
        newMeasurements,
        onMessage,
        'Ошибка редактирования прямоугольника',
        () => {
          setSelectedRectIndex(null);
          setSelectedCorner(null);
        },
      );
    },
    [selectedRectIndex, selectedLayer, tempRectangles],
  );

  const renderRectangle = (rect: Rectangle, color: string, isActive: boolean, index: number) => {
    const screenX = rect.x * scale + imagePosition.x;
    const screenY = rect.y * scale + imagePosition.y;
    const screenWidth = rect.width * scale;
    const screenHeight = rect.height * scale;

    const centerX = screenX + screenWidth / 2;
    const centerY = screenY + screenHeight / 2;

    return (
      <Group key={`rect-${index}`}>
        <Rect
          x={screenX}
          y={screenY}
          width={screenWidth}
          height={screenHeight}
          stroke={color}
          strokeWidth={2}
          fill={`${color}60`}
          opacity={isActive ? 1 : 0.6}
          onContextMenu={isActive ? e => handleRightClick(e, 'RECTANGLE', rect) : undefined}
        />

        {isActive && (
          <>
            <Circle
              x={centerX}
              y={centerY}
              radius={4}
              fill={primaryColor}
              stroke='#333333'
              strokeWidth={1}
              draggable
              onDragStart={e => handleDragStart(e, index)}
              onDragMove={handleDragMove}
              onDragEnd={handleCornerDragEnd}
            />
            <Circle
              x={screenX}
              y={screenY}
              radius={4}
              fill={primaryColor}
              stroke='#333333'
              strokeWidth={1}
              draggable
              onDragStart={e => handleCornerDragStart(e, index, 'top-left')}
              onDragMove={handleCornerDragMove}
              onDragEnd={handleCornerDragEnd}
            />
            <Circle
              x={screenX + screenWidth}
              y={screenY}
              radius={4}
              fill={primaryColor}
              stroke='#333333'
              strokeWidth={1}
              draggable
              onDragStart={e => handleCornerDragStart(e, index, 'top-right')}
              onDragMove={handleCornerDragMove}
              onDragEnd={handleCornerDragEnd}
            />
            <Circle
              x={screenX}
              y={screenY + screenHeight}
              radius={4}
              fill={primaryColor}
              stroke='#333333'
              strokeWidth={1}
              draggable
              onDragStart={e => handleCornerDragStart(e, index, 'bottom-left')}
              onDragMove={handleCornerDragMove}
              onDragEnd={handleCornerDragEnd}
            />
            <Circle
              x={screenX + screenWidth}
              y={screenY + screenHeight}
              radius={4}
              fill={primaryColor}
              stroke='#333333'
              strokeWidth={1}
              draggable
              onDragStart={e => handleCornerDragStart(e, index, 'bottom-right')}
              onDragMove={handleCornerDragMove}
              onDragEnd={handleCornerDragEnd}
            />
          </>
        )}
      </Group>
    );
  };

  const rectanglesToRender =
    selectedRectIndex !== null ? tempRectangles : selectedLayer?.measurements?.rectangles || [];

  return (
    <Layer>
      {disabledRectangles.map((rect, index) => renderRectangle(rect, primaryColor, false, index))}
      {rectanglesToRender.map((rect: any, index: number) => renderRectangle(rect, primaryColor, true, index))}
      {currentRectangle && renderRectangle(currentRectangle, primaryColor, false, -1)}
    </Layer>
  );
};
