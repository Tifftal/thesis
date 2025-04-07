/* eslint-disable no-mixed-operators */
import { useEffect, useState } from 'react';

import { Layer, Stage, Image } from 'react-konva';
import useImage from 'use-image';

import useStore from 'services/zustand/store';
import { Point, Line as LineType, ZustandStoreStateType } from 'services/zustand/types';

import { ContextMenu } from 'components/ContextMenu';
import { BrokenLineLayer } from 'components/MainPage/BrokenLineLayer';
import { LineLayer } from 'components/MainPage/LineLayer';
import { PolygonLayer } from 'components/MainPage/PolygonLayer';

import { defaultContextMenu } from './constants';

import Breast from 'assets/images/mock/breast_cancer.jpg';

export const MainPage = () => {
  const { selectedImage, selectedTool, lines, setLines, brokenLines, setBrokenLines, polygons, setPolygons } =
    useStore((state: ZustandStoreStateType) => state);

  const [imageUrl, setImageUrl] = useState<string>('');
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
  const [isPolygonComplete, setIsPolygonComplete] = useState(false);

  const windowSize = {
    width: window.innerWidth,
    height: window.innerHeight - 90,
  };

  const [scale, setScale] = useState(1);
  const [image] = useImage(imageUrl ?? '');
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });

  const closeContextMenu = () => {
    setContextMenu(defaultContextMenu);
    setBlockCloseContextMenu(false);
  };

  useEffect(() => {
    if (selectedImage) {
      const url = URL.createObjectURL(selectedImage);
      setImageUrl(Breast);
      return () => URL.revokeObjectURL(url);
    }
    setImageUrl('');
  }, [selectedImage]);

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
    if (selectedTool === 'line' && lines.length === 0) return;

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

  // Обработчик клика для создания точек
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
        setCurrentLinePoints(prev => {
          const updated = [...prev, newPoint];
          // Когда набрано 2 точки, сохраняем линию и сбрасываем текущие точки
          if (updated.length === 2) {
            const newLines = [...lines, [updated[0], updated[1]] as LineType];
            setLines(newLines);
            return [];
          }
          return updated;
        });
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
        if (isPolygonComplete) {
          // Начинаем новый многоугольник
          setCurrentPolygon([newPoint]);
          setIsPolygonComplete(false);
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
    }
  };

  const completeCurrentPolygon = () => {
    if (currentPolygon.length > 2) {
      const newPolygons = [...polygons, [...currentPolygon, currentPolygon[0]]];
      setPolygons(newPolygons);
    }
    setIsPolygonComplete(true);
    setCurrentPolygon([]);
    setContextMenu(defaultContextMenu);
  };

  const completeCurrentBrokenLine = () => {
    if (currentBrokenLine.length > 1) {
      const newBrokenLine = [...brokenLines, currentBrokenLine];
      setBrokenLines(newBrokenLine);
    }
    setCurrentBrokenLine([]);
    setContextMenu(defaultContextMenu);
  };

  return (
    <div className='page__container main-page__container' style={{ overflow: 'hidden' }}>
      {selectedImage ? (
        <div className='main-page__image'>
          <Stage
            width={windowSize.width}
            height={windowSize.height}
            onClick={handleStageClick}
            onWheel={handleWheel}
            onContextMenu={e => handleRightClick(e, 'DEFAULT')}>
            <Layer>
              {image && (
                <Image image={image} x={imagePosition.x} y={imagePosition.y} scaleX={scale} scaleY={scale} />
              )}
            </Layer>
            {selectedTool === 'line' && (
              <LineLayer
                scale={scale}
                imagePosition={imagePosition}
                handleRightClick={handleRightClick}
                currentLinePoints={currentLinePoints}
              />
            )}
            {selectedTool === 'broken-line' && (
              <BrokenLineLayer
                scale={scale}
                imagePosition={imagePosition}
                handleRightClick={handleRightClick}
                currentBrokenLine={currentBrokenLine}
              />
            )}
            {selectedTool === 'polygon' && (
              <PolygonLayer
                scale={scale}
                imagePosition={imagePosition}
                currentPolygon={currentPolygon}
                isPolygonComplete={isPolygonComplete}
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
