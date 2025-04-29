/* eslint-disable no-mixed-operators */
import { useEffect, useState } from 'react';

import { Layer, Stage, Image } from 'react-konva';
import useImage from 'use-image';

import useStore from 'services/zustand/store';
import { Point, ZustandStoreStateType, Rectangle } from 'services/zustand/types';

import { ContextMenu } from 'components/ContextMenu';
import { BrokenLineLayer } from 'components/MainPage/BrokenLineLayer';
import { LineLayer } from 'components/MainPage/LineLayer';
import { PolygonLayer } from 'components/MainPage/PolygonLayer';
import { RectangleLayer } from 'components/MainPage/RectangleLayer';

import { ChangeLayer } from 'pages/changeDataHelpers';

import { defaultContextMenu } from './constants';

import useToast from 'utils/hooks/useToast';

export const MainPage = () => {
  const {
    selectedProject,
    setSelectedProject,
    selectedImageURL,
    selectedTool,
    rectangles,
    setRectangles,
    visibleLayers,
    selectedLayer,
    setSelectedLayer,
    setVisibleLayers,
  } = useStore((state: ZustandStoreStateType) => state);

  const { onMessage } = useToast();

  const [contextMenu, setContextMenu] = useState<{
    type: string;
    visible: boolean;
    x: number;
    y: number;
    currentObject: any;
  }>(defaultContextMenu);
  const [blockCloseContextMenu, setBlockCloseContextMenu] = useState(false);
  const [currentLinePoints, setCurrentLinePoints] = useState<Point[]>([]);
  const [currentBrokenLine, setCurrentBrokenLine] = useState<Point[]>([]);
  const [currentPolygon, setCurrentPolygon] = useState<Point[]>([]);
  const [currentRectangle, setCurrentRectangle] = useState<Rectangle | null>(null);
  const [isDrawingRectangle, setIsDrawingRectangle] = useState(false);

  const windowSize = {
    width: window.innerWidth,
    height: window.innerHeight - 90,
  };

  const [scale, setScale] = useState(1);

  const fullImageUrl = selectedImageURL?.startsWith('http') ? selectedImageURL : `http://${selectedImageURL}`;
  const [image] = useImage(encodeURI(fullImageUrl || '') || '');

  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });

  const closeContextMenu = () => {
    setContextMenu(defaultContextMenu);
    setBlockCloseContextMenu(false);
  };

  useEffect(() => {
    if (image) {
      const x = (windowSize.width - image.width * scale) / 2;
      const y = (windowSize.height - image.height * scale) / 2;
      setImagePosition({ x, y });
    }
  }, [image]);

  useEffect(() => {
    const handleClickOutside = () => {
      if (!blockCloseContextMenu) {
        closeContextMenu();
      }
      setBlockCloseContextMenu(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [blockCloseContextMenu]);

  const handleRightClick = (e: any, type: string, currentObject?: any) => {
    e.evt.preventDefault();
    const stage = e.target.getStage();
    const pointer = stage.getPointerPosition();

    if (type === 'DEFAULT' && e.target.getClassName() !== 'Image') return;
    if (type === 'DEFAULT' && e.target.getClassName() === 'Image') {
      setContextMenu(defaultContextMenu);
      return;
    }

    setContextMenu({
      type: type,
      visible: true,
      x: pointer.x + window.scrollX,
      y: pointer.y + window.scrollY,
      currentObject: currentObject,
    });
  };

  const handleWheel = (e: any) => {
    e.evt.preventDefault();
    const scaleBy = 1.05;
    const stage = e.target.getStage();
    const pointer = stage.getPointerPosition();

    if (!pointer || !image) return;

    const direction = e.evt.deltaY > 0 ? -1 : 1;
    const newScale = scale * Math.pow(scaleBy, direction);

    const mouseX = (pointer.x - imagePosition.x) / scale;
    const mouseY = (pointer.y - imagePosition.y) / scale;

    const newX = pointer.x - mouseX * newScale;
    const newY = pointer.y - mouseY * newScale;

    setScale(newScale);
    setImagePosition({
      x: newX,
      y: newY,
    });
  };

  // Обработчик клика для создания точек TODO: вынести и отрефакторить
  const handleStageClick = (e: any) => {
    if (e.evt.button !== 0) return;

    const stage = e.target.getStage();
    const pointer = stage.getPointerPosition();
    if (!pointer || !image) return;

    const x = (pointer.x - imagePosition.x) / scale;
    const y = (pointer.y - imagePosition.y) / scale;

    if (x >= 0 && y >= 0 && x <= image.width && y <= image.height) {
      const newPoint = { x, y };

      if (selectedTool === 'line') {
        const updated = [...currentLinePoints, newPoint];

        // Когда набрано 2 точки, сохраняем линию и сбрасываем текущие точки
        if (updated.length === 2) {
          const newLine = [updated[0], updated[1]];
          const newMeasurements = JSON.parse(JSON.stringify(selectedLayer?.measurements || {}));

          if (!newMeasurements.lines) {
            newMeasurements.lines = [];
          }

          newMeasurements.lines.push(newLine);

          ChangeLayer(
            selectedProject,
            setSelectedProject,
            selectedLayer,
            setSelectedLayer,
            visibleLayers,
            setVisibleLayers,
            newMeasurements,
            onMessage,
            'Ошибка создания линии',
          );

          setCurrentLinePoints([]);
          return;
        }

        setCurrentLinePoints(updated);
      }

      if (selectedTool === 'broken-line') {
        setCurrentBrokenLine(prev => [...prev, newPoint]);
        if (currentBrokenLine.length > 0) {
          setBlockCloseContextMenu(true);
          setContextMenu({
            visible: true,
            type: 'BROKEN_LINE',
            x: pointer.x + window.scrollX,
            y: pointer.y + window.scrollY,
            currentObject: null,
          });
        }
      }

      if (selectedTool === 'polygon') {
        if (!currentPolygon.length) {
          setCurrentPolygon([newPoint]);
        } else {
          setCurrentPolygon(prev => [...prev, newPoint]);
          // Открываем контекстное меню после первого сегмента
          if (currentPolygon.length > 1) {
            setBlockCloseContextMenu(true);
            setContextMenu({
              visible: true,
              type: 'POLYGON',
              x: pointer.x + window.scrollX,
              y: pointer.y + window.scrollY,
              currentObject: null,
            });
          }
        }
      }

      if (selectedTool === 'rectangle') {
        if (!isDrawingRectangle) {
          // Начинаем рисовать прямоугольник
          setCurrentRectangle({
            x: newPoint.x,
            y: newPoint.y,
            width: 0,
            height: 0,
          });
          setIsDrawingRectangle(true);
        } else {
          // Завершаем рисование прямоугольника
          const newRectangles = [...rectangles, currentRectangle!];
          setRectangles(newRectangles);
          setCurrentRectangle(null);
          setIsDrawingRectangle(false);
        }
      }
    }
  };

  const completeCurrentPolygon = () => {
    if (!currentPolygon.length) return;

    const newMeasurements = JSON.parse(JSON.stringify(selectedLayer?.measurements || {}));

    if (!newMeasurements.polygons) {
      newMeasurements.polygons = [];
    }

    newMeasurements.polygons.push(currentPolygon);

    ChangeLayer(
      selectedProject,
      setSelectedProject,
      selectedLayer,
      setSelectedLayer,
      visibleLayers,
      setVisibleLayers,
      newMeasurements,
      onMessage,
      'Ошибка создания многоугольника',
    );

    setCurrentPolygon([]);
    setContextMenu(defaultContextMenu);
  };

  const completeCurrentBrokenLine = () => {
    if (!currentBrokenLine.length) return;

    const newMeasurements = JSON.parse(JSON.stringify(selectedLayer?.measurements || {}));

    if (!newMeasurements.brokenLines) {
      newMeasurements.brokenLines = [];
    }

    newMeasurements.brokenLines.push(currentBrokenLine);

    ChangeLayer(
      selectedProject,
      setSelectedProject,
      selectedLayer,
      setSelectedLayer,
      visibleLayers,
      setVisibleLayers,
      newMeasurements,
      onMessage,
      'Ошибка создания ломаной',
    );

    setCurrentBrokenLine([]);
    setContextMenu(defaultContextMenu);
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawingRectangle || selectedTool !== 'rectangle') return;

    const stage = e.target.getStage();
    const pointer = stage.getPointerPosition();
    if (!pointer || !image || !currentRectangle) return;

    const x = (pointer.x - imagePosition.x) / scale;
    const y = (pointer.y - imagePosition.y) / scale;

    setCurrentRectangle({
      x: currentRectangle.x,
      y: currentRectangle.y,
      width: x - currentRectangle.x,
      height: y - currentRectangle.y,
    });
  };

  const handleRectangleDragEnd = (index: number, rect: Rectangle) => {
    const newRectangles = [...rectangles];
    newRectangles[index] = rect;
    setRectangles(newRectangles);
  };

  const handleRectangleTransformEnd = (index: number, rect: Rectangle) => {
    const newRectangles = [...rectangles];
    newRectangles[index] = rect;
    setRectangles(newRectangles);
  };

  return (
    <div className='page__container main-page__container' style={{ overflow: 'hidden' }}>
      {selectedImageURL ? (
        <div className='main-page__image'>
          <Stage
            width={windowSize.width}
            height={windowSize.height}
            onClick={handleStageClick}
            onWheel={handleWheel}
            onMouseMove={handleMouseMove}
            onContextMenu={e => handleRightClick(e, 'DEFAULT')}>
            <Layer>
              {image && (
                <Image image={image} x={imagePosition.x} y={imagePosition.y} scaleX={scale} scaleY={scale} />
              )}
            </Layer>

            <LineLayer
              scale={scale}
              imagePosition={imagePosition}
              handleRightClick={handleRightClick}
              currentLinePoints={currentLinePoints}
            />

            <BrokenLineLayer
              scale={scale}
              imagePosition={imagePosition}
              handleRightClick={handleRightClick}
              currentBrokenLine={currentBrokenLine}
            />

            <PolygonLayer
              scale={scale}
              imagePosition={imagePosition}
              handleRightClick={handleRightClick}
              currentPolygon={currentPolygon}
            />

            {selectedTool === 'rectangle' && (
              <RectangleLayer
                scale={scale}
                imagePosition={imagePosition}
                currentRectangle={currentRectangle}
                rectangles={rectangles}
                onDragEnd={handleRectangleDragEnd}
                onTransformEnd={handleRectangleTransformEnd}
              />
            )}
          </Stage>
        </div>
      ) : (
        <div>Пока ничего не выбрано...</div>
      )}

      {contextMenu.visible && (
        <ContextMenu
          contextMenu={contextMenu}
          closeContextMenu={closeContextMenu}
          setCurrentLinePoints={setCurrentLinePoints}
          onCompleteBrokenLine={completeCurrentBrokenLine}
          setCurrentBrokenLine={setCurrentBrokenLine}
          onCompletePolygon={completeCurrentPolygon}
        />
      )}
    </div>
  );
};
