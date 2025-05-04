/* eslint-disable no-mixed-operators */
import { useState, useEffect, useCallback } from 'react';

import { Layer, Ellipse as KonvaEllipse, Circle, Group } from 'react-konva';

import useStore from 'services/zustand/store';
import { Ellipse, ZustandStoreStateType } from 'services/zustand/types';

import { ChangeLayer } from 'pages/changeDataHelpers';

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
  const [selectedControlPoint, setSelectedControlPoint] = useState<'radiusX' | 'radiusY' | null>(null);

  useEffect(() => {
    const disabledLayers = visibleLayers.filter(layer => layer.id !== selectedLayer?.id);
    const allEllipses = disabledLayers.flatMap(layer => layer.measurements?.ellipses || []);
    setDisabledEllipses(allEllipses);
  }, [visibleLayers, selectedLayer]);

  useEffect(() => {
    if (selectedLayer?.measurements?.ellipses) {
      setTempEllipses([...selectedLayer.measurements.ellipses]);
    }
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

      const x = (pointer.x - imagePosition.x - stagePosition.x) / scale;
      const y = (pointer.y - imagePosition.y - stagePosition.y) / scale;

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

  const handleResizeStart = (e: any, index: number, controlPoint: 'radiusX' | 'radiusY') => {
    e.cancelBubble = true;
    setSelectedEllipseIndex(index);
    setSelectedControlPoint(controlPoint);
  };

  const handleResizeMove = useCallback(
    (e: any) => {
      e.cancelBubble = true;

      if (selectedEllipseIndex === null || selectedControlPoint === null) return;

      const stage = e.target.getStage();
      const pointer = stage.getPointerPosition();
      if (!pointer) return;

      const x = (pointer.x - imagePosition.x - stagePosition.x) / scale;
      const y = (pointer.y - imagePosition.y - stagePosition.y) / scale;

      setTempEllipses(prev => {
        const updated = [...prev];
        const ellipse = updated[selectedEllipseIndex];

        if (selectedControlPoint === 'radiusX') {
          updated[selectedEllipseIndex] = {
            ...ellipse,
            radiusX: Math.abs(x - ellipse.x),
          };
        } else {
          updated[selectedEllipseIndex] = {
            ...ellipse,
            radiusY: Math.abs(y - ellipse.y),
          };
        }

        return updated;
      });
    },
    [selectedEllipseIndex, selectedControlPoint, scale, imagePosition, stagePosition],
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
          setSelectedControlPoint(null);
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

    // Точки для изменения radiusX и radiusY
    const controlPointX = screenX + screenRadiusX;
    const controlPointY = screenY + screenRadiusY;

    return (
      <Group key={`ellipse-group-${index}`}>
        <KonvaEllipse
          x={screenX}
          y={screenY}
          radiusX={screenRadiusX}
          radiusY={screenRadiusY}
          fill='rgba(255, 0, 0, 0.5)'
          stroke='rgb(255, 0, 0)'
          strokeWidth={2}
          onContextMenu={e => handleRightClick(e, 'ELLIPSE', ellipse)}
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
          onContextMenu={e => handleRightClick(e, 'ELLIPSE', ellipse)}
        />

        {isActive && (
          <>
            <Circle
              x={controlPointX}
              y={screenY}
              radius={4}
              fill='red'
              stroke='darkred'
              strokeWidth={1}
              draggable
              dragBoundFunc={pos => {
                return {
                  x: pos.x,
                  y: screenY,
                };
              }}
              onDragStart={e => handleResizeStart(e, index, 'radiusX')}
              onDragMove={handleResizeMove}
              onDragEnd={handleResizeEnd}
            />
            <Circle
              x={screenX}
              y={controlPointY}
              radius={4}
              fill='red'
              stroke='darkred'
              strokeWidth={1}
              draggable
              dragBoundFunc={pos => {
                return {
                  x: screenX,
                  y: pos.y,
                };
              }}
              onDragStart={e => handleResizeStart(e, index, 'radiusY')}
              onDragMove={handleResizeMove}
              onDragEnd={handleResizeEnd}
            />
          </>
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
          key={`disabled-ellipse-${index}`}
          x={ellipse.x * scale + imagePosition.x}
          y={ellipse.y * scale + imagePosition.y}
          radiusX={ellipse.radiusX * scale}
          radiusY={ellipse.radiusY * scale}
          fill='rgba(255, 0, 0, 0.3)'
          stroke='rgba(255, 0, 0, 0.5)'
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
            stroke='rgb(0, 255, 0)'
            fill='rgba(0, 255, 0, 0.4)'
            strokeWidth={2}
            dash={[5, 5]}
          />
          <KonvaEllipse
            x={currentEllipse.x * scale + imagePosition.x}
            y={currentEllipse.y * scale + imagePosition.y}
            radiusX={4 / scale}
            radiusY={4 / scale}
            fill='rgb(0, 255, 0)'
          />
        </Group>
      )}
    </Layer>
  );
};
