/* eslint-disable no-mixed-operators */
import React, { useEffect, useState, useCallback } from 'react';

import { Circle, Layer, Group } from 'react-konva';

import useStore from 'services/zustand/store';
import { Circle as CircleType, ZustandStoreStateType } from 'services/zustand/types';

import { ChangeLayer, getScaledPosition } from 'pages/helpers';

import useToast from 'utils/hooks/useToast';

type Props = {
  scale: number;
  imagePosition: { x: number; y: number };
  handleRightClick: (e: any, type: string, currentObject?: any) => void;
  currentCircle: CircleType | null;
};

export const CircleLayer = (props: Props) => {
  const { scale, imagePosition, handleRightClick, currentCircle } = props;
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

  const [disabledCircles, setDisabledCircles] = useState<CircleType[]>([]);
  const [tempCircles, setTempCircles] = useState<CircleType[]>([]);
  const [selectedCircleIndex, setSelectedCircleIndex] = useState<number | null>(null);

  useEffect(() => {
    const disabledLayers = visibleLayers.filter(layer => layer.id !== selectedLayer?.id);
    const allCircles = disabledLayers.flatMap(layer => layer.measurements?.circles || []);
    setDisabledCircles(allCircles);
  }, [visibleLayers, selectedLayer]);

  useEffect(() => {
    if (selectedLayer?.measurements?.circles) {
      setTempCircles([...selectedLayer.measurements.circles]);
    }
  }, [selectedLayer]);

  const handleDragStart = (e: any, index: number) => {
    e.cancelBubble = true;
    setSelectedCircleIndex(index);
  };

  const handleDragMove = useCallback(
    (e: any) => {
      e.cancelBubble = true;

      if (selectedCircleIndex === null) return;

      const stage = e.target.getStage();
      const pointer = stage.getPointerPosition();
      if (!pointer) return;

      const { x, y } = getScaledPosition(pointer, imagePosition, stagePosition, scale);

      setTempCircles(prev => {
        const updated = [...prev];
        updated[selectedCircleIndex] = {
          ...updated[selectedCircleIndex],
          x,
          y,
        };
        return updated;
      });
    },
    [selectedCircleIndex, scale, imagePosition, stagePosition],
  );

  const handleResizeStart = (e: any, index: number) => {
    e.cancelBubble = true;
    setSelectedCircleIndex(index);
  };

  const handleResizeMove = useCallback(
    (e: any) => {
      e.cancelBubble = true;

      if (selectedCircleIndex === null) return;

      const stage = e.target.getStage();
      const pointer = stage.getPointerPosition();
      if (!pointer) return;

      const { x, y } = getScaledPosition(pointer, imagePosition, stagePosition, scale);

      setTempCircles(prev => {
        const updated = [...prev];
        const circle = updated[selectedCircleIndex];

        const dx = x - circle.x;
        const dy = y - circle.y;
        const newRadius = Math.sqrt(dx * dx + dy * dy);

        updated[selectedCircleIndex] = {
          ...circle,
          radius: newRadius,
        };

        return updated;
      });
    },
    [selectedCircleIndex, scale, imagePosition],
  );

  const handleResizeEnd = useCallback(
    (e: any) => {
      e.cancelBubble = true;
      if (selectedCircleIndex === null || !selectedLayer) return;

      const newMeasurements = {
        ...selectedLayer.measurements,
        circles: tempCircles,
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
        'Ошибка редактирования окружности',
        () => setSelectedCircleIndex(null),
      );
    },
    [selectedCircleIndex, selectedLayer, tempCircles],
  );

  const renderCircleWithControls = (circle: CircleType, index: number, isActive: boolean) => {
    const screenX = circle.x * scale + imagePosition.x;
    const screenY = circle.y * scale + imagePosition.y;
    const screenRadius = circle.radius * scale;

    const controlPointX = screenX + screenRadius / Math.sqrt(2);
    const controlPointY = screenY + screenRadius / Math.sqrt(2);

    return (
      <Group key={`circle-group-${index}`}>
        <Circle
          x={screenX}
          y={screenY}
          radius={screenRadius}
          fill='rgba(255, 0, 0, 0.5)'
          stroke='rgb(255, 0, 0)'
          strokeWidth={2}
          onContextMenu={e => handleRightClick(e, 'CIRCLE', circle)}
        />

        <Circle
          x={screenX}
          y={screenY}
          radius={4}
          fill='red'
          stroke='darkred'
          strokeWidth={1}
          draggable={isActive}
          onDragStart={e => handleDragStart(e, index)}
          onDragMove={handleDragMove}
          onDragEnd={handleResizeEnd}
          onContextMenu={e => handleRightClick(e, 'CIRCLE', circle)}
        />

        {isActive && (
          <Circle
            x={controlPointX}
            y={controlPointY}
            radius={4}
            fill='red'
            stroke='darkred'
            strokeWidth={1}
            draggable
            onDragStart={e => handleResizeStart(e, index)}
            onDragMove={handleResizeMove}
            onDragEnd={handleResizeEnd}
          />
        )}
      </Group>
    );
  };

  const circlesToRender =
    selectedCircleIndex !== null ? tempCircles : selectedLayer?.measurements?.circles || [];

  return (
    <Layer>
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

      {circlesToRender.map((circle: CircleType, index: number) =>
        renderCircleWithControls(circle, index, true),
      )}

      {currentCircle && (
        <Group>
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
        </Group>
      )}
    </Layer>
  );
};
