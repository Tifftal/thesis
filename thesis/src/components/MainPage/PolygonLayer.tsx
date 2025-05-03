/* eslint-disable no-mixed-operators */
import React, { useEffect, useState } from 'react';

import { Layer, Line, Circle } from 'react-konva';

import useStore from 'services/zustand/store';
import { Point, Polygon, ZustandStoreStateType } from 'services/zustand/types';

import { ChangeLayer } from 'pages/changeDataHelpers';

import useToast from 'utils/hooks/useToast';

type Props = {
  scale: number;
  imagePosition: { x: number; y: number };
  handleRightClick: (e: any, type: string, currentObject?: any) => void;
  currentPolygon: Point[];
};

export const PolygonLayer = (props: Props) => {
  const { scale, imagePosition, handleRightClick, currentPolygon } = props;

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

  const [disabledPolygons, setDisabledPolygons] = useState<Polygon[]>([]);
  const [selectedLineIndex, setSelectedLineIndex] = useState<number | null>(null);
  const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(null);
  const [tempLines, setTempLines] = useState<Polygon[]>([]); //нужно для редактирования линии в реальном времени

  useEffect(() => {
    if (selectedLayer?.measurements?.polygons) {
      setTempLines([...selectedLayer.measurements.polygons]);
    }
  }, [selectedLayer]);

  useEffect(() => {
    const disabledLayers = visibleLayers.filter(layer => layer.id !== selectedLayer?.id);
    const allPolygons = disabledLayers.flatMap(layer => layer.measurements?.polygons || []);
    setDisabledPolygons(allPolygons);
  }, [visibleLayers, selectedLayer]);

  const handlePointDragMove = (e: any) => {
    e.cancelBubble = true;
    if (selectedLineIndex === null || selectedPointIndex === null) return;

    const stage = e.target.getStage();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const x = (pointer.x - imagePosition.x - stagePosition.x) / scale;
    const y = (pointer.y - imagePosition.y - stagePosition.y) / scale;

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

    if (
      selectedLineIndex === null ||
      selectedPointIndex === null ||
      !selectedLayer ||
      !selectedLayer.measurements?.polygons
    ) {
      return;
    }

    const newMeasurements = {
      ...selectedLayer.measurements,
      polygons: tempLines,
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
      'Ошибка редактирования полигона',
    );

    setSelectedLineIndex(null);
    setSelectedPointIndex(null);
  };

  const renderPolygon = (points: Point[], color: string, isActive: boolean, polygonIndex: number) => {
    const flatPoints = points.flatMap(point => [
      point.x * scale + imagePosition.x,
      point.y * scale + imagePosition.y,
    ]);

    return (
      <>
        <Line
          points={flatPoints}
          stroke={color}
          strokeWidth={2}
          closed={true}
          fill={`${color}80`}
          onContextMenu={isActive ? e => handleRightClick(e, 'POLYGON', points) : undefined}
        />
        {points.map((point, pointIndex) => (
          <Circle
            key={`polygon-point-${pointIndex}`}
            x={point.x * scale + imagePosition.x}
            y={point.y * scale + imagePosition.y}
            radius={4}
            fill={color}
            onContextMenu={isActive ? e => handleRightClick(e, 'POLYGON', points) : undefined}
            draggable={isActive}
            onDragStart={e => handlePointDragStart(e, polygonIndex, pointIndex)}
            onDragMove={handlePointDragMove}
            onDragEnd={handlePointDragEnd}
          />
        ))}
      </>
    );
  };

  const linesToRender = selectedLineIndex !== null ? tempLines : selectedLayer?.measurements?.polygons || [];

  return (
    <Layer>
      {linesToRender.map((polygon: Polygon, index: number) => (
        <React.Fragment key={`polygon-${index}`}>
          {renderPolygon(polygon, '#ff0000', true, index)}
        </React.Fragment>
      ))}

      {disabledPolygons.map((polygon, index) => (
        <React.Fragment key={`polygon-${index}`}>
          {renderPolygon(polygon, '#e85050', false, index)}
        </React.Fragment>
      ))}

      {currentPolygon.length > 0 && <>{renderPolygon(currentPolygon, '#26f704', true, 0)}</>}
    </Layer>
  );
};
