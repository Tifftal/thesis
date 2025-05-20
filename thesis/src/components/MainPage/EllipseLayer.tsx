/* eslint-disable no-mixed-operators */
import { useState, useEffect, useCallback } from 'react';

import { Layer, Ellipse as KonvaEllipse, Circle, Group } from 'react-konva';

import useStore from 'services/zustand/store';
import { Ellipse, ZustandStoreStateType } from 'services/zustand/types';

import { ChangeLayer, getScaledPosition } from 'pages/helpers';

import useToast from 'utils/hooks/useToast';

type Props = {
  scale: number;
  imagePosition: { x: number; y: number };
  handleRightClick: (e: any, type: string, currentObject?: any) => void;
  currentEllipse: Ellipse | null;
};

export const EllipseLayer = (props: Props) => {
  const { scale, imagePosition, handleRightClick, currentEllipse } = props;
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

  const [disabledEllipses, setDisabledEllipses] = useState<Ellipse[]>([]);
  const [tempEllipses, setTempEllipses] = useState<Ellipse[]>([]);
  const [selectedEllipseIndex, setSelectedEllipseIndex] = useState<number | null>(null);
  const [primaryColor, setPrimaryColor] = useState<string>(
    selectedLayer?.color ? `#${selectedLayer?.color}` : '#a0f600',
  );

  useEffect(() => {
    const disabledLayers = visibleLayers.filter(layer => layer.id !== selectedLayer?.id);
    const allEllipses = disabledLayers.flatMap(layer => layer.measurements?.ellipses || []);
    setDisabledEllipses(allEllipses);
  }, [visibleLayers, selectedLayer]);

  useEffect(() => {
    if (selectedLayer?.measurements?.ellipses) {
      setTempEllipses([...selectedLayer.measurements.ellipses]);
    }
    setPrimaryColor(selectedLayer?.color ? `#${selectedLayer?.color}` : '#a0f600');
  }, [selectedLayer]);

  const handleDragStart = (e: any, index: number) => {
    e.cancelBubble = true;
    setSelectedEllipseIndex(index);
  };

  const handleDragMove = useCallback(
    (e: any) => {
      e.cancelBubble = true;

      if (selectedEllipseIndex === null) return;

      const stage = e.target.getStage();
      const pointer = stage.getPointerPosition();
      if (!pointer) return;

      const { x, y } = getScaledPosition(pointer, imagePosition, stagePosition, scale);

      setTempEllipses(prev => {
        const updated = [...prev];
        updated[selectedEllipseIndex] = {
          ...updated[selectedEllipseIndex],
          x,
          y,
        };
        return updated;
      });
    },
    [selectedEllipseIndex, scale, imagePosition, stagePosition],
  );

  const handleResizeStart = (e: any, index: number) => {
    e.cancelBubble = true;
    setSelectedEllipseIndex(index);
  };

  const handleResizeMove = useCallback(
    (e: any) => {
      e.cancelBubble = true;

      if (selectedEllipseIndex === null) return;

      const stage = e.target.getStage();
      const pointer = stage.getPointerPosition();
      if (!pointer) return;

      const { x, y } = getScaledPosition(pointer, imagePosition, stagePosition, scale);

      setTempEllipses(prev => {
        const updated = [...prev];
        const ellipse = updated[selectedEllipseIndex];

        updated[selectedEllipseIndex] = {
          ...ellipse,
          radiusX: Math.abs(x - ellipse.x),
          radiusY: Math.abs(y - ellipse.y),
        };

        return updated;
      });
    },
    [selectedEllipseIndex, scale, imagePosition],
  );

  const handleResizeEnd = useCallback(
    (e: any) => {
      e.cancelBubble = true;
      if (selectedEllipseIndex === null || !selectedLayer) return;

      const newMeasurements = {
        ...selectedLayer.measurements,
        ellipses: tempEllipses,
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
        'Ошибка редактирования эллипса',
        () => {
          setSelectedEllipseIndex(null);
        },
      );
    },
    [selectedEllipseIndex, selectedLayer, tempEllipses],
  );

  const renderEllipseWithControls = (ellipse: Ellipse, index: number, isActive: boolean) => {
    const screenX = ellipse.x * scale + imagePosition.x;
    const screenY = ellipse.y * scale + imagePosition.y;
    const screenRadiusX = ellipse.radiusX * scale;
    const screenRadiusY = ellipse.radiusY * scale;

    const controlPointX = screenX + screenRadiusX;
    const controlPointY = screenY + screenRadiusY;

    return (
      <Group key={`ellipse-group-${index}`}>
        <KonvaEllipse
          x={screenX}
          y={screenY}
          radiusX={screenRadiusX}
          radiusY={screenRadiusY}
          fill={`${primaryColor}80`}
          stroke={primaryColor}
          strokeWidth={2}
          onContextMenu={e => handleRightClick(e, 'ELLIPSE', ellipse)}
        />

        <Circle
          x={screenX}
          y={screenY}
          radius={4}
          fill={primaryColor}
          stroke='#333333'
          strokeWidth={1}
          draggable={isActive}
          onDragStart={e => handleDragStart(e, index)}
          onDragMove={handleDragMove}
          onDragEnd={handleResizeEnd}
          onContextMenu={e => handleRightClick(e, 'ELLIPSE', ellipse)}
        />

        {isActive && (
          <Circle
            x={controlPointX}
            y={controlPointY}
            radius={4}
            fill={primaryColor}
            stroke='#333333'
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

  const ellipsesToRender =
    selectedEllipseIndex !== null ? tempEllipses : selectedLayer?.measurements?.ellipses || [];

  return (
    <Layer>
      {disabledEllipses.map((ellipse, index) => (
        <KonvaEllipse
          opacity={0.6}
          key={`disabled-ellipse-${index}`}
          x={ellipse.x * scale + imagePosition.x}
          y={ellipse.y * scale + imagePosition.y}
          radiusX={ellipse.radiusX * scale}
          radiusY={ellipse.radiusY * scale}
          fill={`${primaryColor}80`}
          stroke={primaryColor}
          strokeWidth={2}
        />
      ))}

      {ellipsesToRender.map((ellipse: Ellipse, index: number) =>
        renderEllipseWithControls(ellipse, index, true),
      )}

      {currentEllipse && (
        <Group>
          <KonvaEllipse
            x={currentEllipse.x * scale + imagePosition.x}
            y={currentEllipse.y * scale + imagePosition.y}
            radiusX={currentEllipse.radiusX * scale}
            radiusY={currentEllipse.radiusY * scale}
            fill={`${primaryColor}80`}
            stroke={primaryColor}
            strokeWidth={2}
            dash={[5, 5]}
          />
          <Circle
            x={currentEllipse.x * scale + imagePosition.x}
            y={currentEllipse.y * scale + imagePosition.y}
            radius={4}
            fill={primaryColor}
          />
        </Group>
      )}
    </Layer>
  );
};
