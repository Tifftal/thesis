/* eslint-disable complexity */
/* eslint-disable no-mixed-operators */
import { useEffect, useState } from 'react';

import { Layer, Stage, Image } from 'react-konva';
import useImage from 'use-image';

import useStore from 'services/zustand/store';
import { Point, ZustandStoreStateType, Rectangle, Circle, Ellipse } from 'services/zustand/types';

import { ContextMenu } from 'components/ContextMenu';
import { BrokenLineLayer } from 'components/MainPage/BrokenLineLayer';
import { CircleLayer } from 'components/MainPage/CircleLayer';
import { EllipseLayer } from 'components/MainPage/EllipseLayer';
import { LineLayer } from 'components/MainPage/LineLayer';
import { PolygonLayer } from 'components/MainPage/PolygonLayer';
import { RectangleLayer } from 'components/MainPage/RectangleLayer';

import { AddGeneratedObjectToLayerModal } from 'common/AddGeneratedObjectToLayerModal/AddGeneratedObjectToLayerModal';

import { defaultContextMenu } from './constants';

import { ChangeLayer, getScaledPosition } from 'pages/helpers';

import useToast from 'utils/hooks/useToast';

export const MainPage = () => {
  const {
    selectedProject,
    setSelectedProject,
    selectedImage,
    selectedTool,
    visibleLayers,
    selectedLayer,
    setSelectedLayer,
    setVisibleLayers,
    stagePosition,
    setStagePosition,
    setScaleFactor,
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

  const [currentCircle, setCurrentCircle] = useState<Circle | null>(null);
  const [isDrawingCircle, setIsDrawingCircle] = useState(false);

  const [currentEllipse, setCurrentEllipse] = useState<Ellipse | null>(null);
  const [isDrawingEllipse, setIsDrawingEllipse] = useState(false);

  const windowSize = {
    width: window.innerWidth,
    height: window.innerHeight - 90,
  };

  const [scale, setScale] = useState(1);

  const fullImageUrl = selectedImage?.url?.startsWith('http')
    ? selectedImage.url
    : `http://${selectedImage?.url}`;
  const [image] = useImage(encodeURI(fullImageUrl || '') || '');

  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });

  const closeContextMenu = () => {
    setContextMenu(defaultContextMenu);
    setBlockCloseContextMenu(false);
  };

  useEffect(() => {
    if (image) {
      const newScale = windowSize.height / image.height;
      const newWidth = image.width * newScale;

      const x = (windowSize.width - newWidth) / 2;
      const y = 0;

      setScale(newScale);
      setImagePosition({ x, y });
      if (selectedImage) {
        setScaleFactor(selectedImage?.width / image.width);
      }
    }
  }, [image, windowSize.height, windowSize.width]);

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
    if (contextMenu.visible && !currentBrokenLine.length && !currentPolygon.length) {
      setContextMenu(defaultContextMenu);
      return;
    }

    const stage = e.target.getStage();
    const pointer = stage.getPointerPosition();
    if (!pointer || !image) return;

    const { x, y } = getScaledPosition(pointer, imagePosition, stagePosition, scale);

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
          const newMeasurements = JSON.parse(JSON.stringify(selectedLayer?.measurements || {}));

          if (!newMeasurements.rectangles) {
            newMeasurements.rectangles = [];
          }

          newMeasurements.rectangles.push(currentRectangle);

          ChangeLayer(
            selectedProject,
            setSelectedProject,
            selectedLayer,
            setSelectedLayer,
            visibleLayers,
            setVisibleLayers,
            newMeasurements,
            onMessage,
            'Ошибка создания прямоугольника',
          );

          setCurrentRectangle(null);
          setIsDrawingRectangle(false);
        }
      }

      if (selectedTool === 'circle') {
        if (!isDrawingCircle) {
          setCurrentCircle({
            x: newPoint.x,
            y: newPoint.y,
            radius: 0,
          });
          setIsDrawingCircle(true);
        } else {
          // Завершаем рисование круга
          const newMeasurements = JSON.parse(JSON.stringify(selectedLayer?.measurements || {}));

          if (!newMeasurements.circles) {
            newMeasurements.circles = [];
          }

          newMeasurements.circles.push(currentCircle);

          ChangeLayer(
            selectedProject,
            setSelectedProject,
            selectedLayer,
            setSelectedLayer,
            visibleLayers,
            setVisibleLayers,
            newMeasurements,
            onMessage,
            'Ошибка создания круга',
          );

          setCurrentCircle(null);
          setIsDrawingCircle(false);
        }
      }

      if (selectedTool === 'ellipse') {
        if (!isDrawingEllipse) {
          setCurrentEllipse({
            x: newPoint.x,
            y: newPoint.y,
            radiusX: 0,
            radiusY: 0,
          });
          setIsDrawingEllipse(true);
        } else {
          const newMeasurements = JSON.parse(JSON.stringify(selectedLayer?.measurements || {}));

          if (!newMeasurements.ellipses) {
            newMeasurements.ellipses = [];
          }

          newMeasurements.ellipses.push(currentEllipse);

          ChangeLayer(
            selectedProject,
            setSelectedProject,
            selectedLayer,
            setSelectedLayer,
            visibleLayers,
            setVisibleLayers,
            newMeasurements,
            onMessage,
            'Ошибка создания эллипса',
            () => {
              setCurrentEllipse(null);
              setIsDrawingEllipse(false);
            },
          );
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
    const stage = e.target.getStage();
    const pointer = stage.getPointerPosition();
    if (!pointer || !image) return;

    const { x, y } = getScaledPosition(pointer, imagePosition, stagePosition, scale);

    if (isDrawingRectangle && selectedTool === 'rectangle' && !!currentRectangle) {
      setCurrentRectangle({
        x: currentRectangle.x,
        y: currentRectangle.y,
        width: x - currentRectangle.x,
        height: y - currentRectangle.y,
      });
    }

    if (isDrawingCircle && selectedTool === 'circle' && !!currentCircle) {
      const radius = Math.sqrt(Math.pow(x - currentCircle.x, 2) + Math.pow(y - currentCircle.y, 2));
      setCurrentCircle({
        x: currentCircle.x,
        y: currentCircle.y,
        radius,
      });
    }

    if (isDrawingEllipse && selectedTool === 'ellipse' && !!currentEllipse) {
      const radiusX = Math.abs(x - currentEllipse.x);
      const radiusY = Math.abs(y - currentEllipse.y);
      setCurrentEllipse({
        x: currentEllipse.x,
        y: currentEllipse.y,
        radiusX,
        radiusY,
      });
    }
  };

  const handleDragStage = (e: any) => {
    setStagePosition({ x: e.target.attrs.x, y: e.target.attrs.y });
  };

  return (
    <div className='page__container main-page__container' style={{ overflow: 'hidden' }}>
      {selectedImage?.url ? (
        <div className='main-page__image'>
          <Stage
            width={windowSize.width}
            height={windowSize.height}
            onClick={handleStageClick}
            onWheel={handleWheel}
            onMouseMove={handleMouseMove}
            onContextMenu={e => handleRightClick(e, 'DEFAULT')}
            draggable
            onDragEnd={handleDragStage}>
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

            <RectangleLayer
              scale={scale}
              imagePosition={imagePosition}
              handleRightClick={handleRightClick}
              currentRectangle={currentRectangle}
            />

            <CircleLayer
              scale={scale}
              imagePosition={imagePosition}
              handleRightClick={handleRightClick}
              currentCircle={currentCircle}
            />

            <EllipseLayer
              scale={scale}
              imagePosition={imagePosition}
              handleRightClick={handleRightClick}
              currentEllipse={currentEllipse}
            />
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

      <AddGeneratedObjectToLayerModal />
    </div>
  );
};
