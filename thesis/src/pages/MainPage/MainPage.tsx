/* eslint-disable no-mixed-operators */
import { useEffect, useState } from 'react';
import React from 'react';

import { Layer, Stage, Image, Circle, Line } from 'react-konva';
import useImage from 'use-image';

import useStore from 'services/zustand/store';
import { Point, Line as LineType, ZustandStoreStateType } from 'services/zustand/types';

import { ContextMenu } from 'components/ContextMenu';
import { LineLayer } from 'components/MainPage/LineLayer';

import { defaultContextMenu } from './constants';

import Breast from 'assets/images/mock/breast_cancer.jpg';

export const MainPage = () => {
  const { selectedImage, selectedTool, lines, setLines } = useStore((state: ZustandStoreStateType) => state);

  const [imageUrl, setImageUrl] = useState<string>('');
  const [contextMenu, setContextMenu] = useState<{
    type: string;
    visible: boolean;
    x: number;
    y: number;
    currentObject: any;
  }>(defaultContextMenu);
  const [currentLinePoints, setCurrentLinePoints] = useState<Point[]>([]);
  const [brokenLines, setBrokenLines] = useState<Point[][]>([]); // Все ломаные линии
  const [currentBrokenLine, setCurrentBrokenLine] = useState<Point[]>([]); // Текущая создаваемая ломаная

  const windowSize = {
    width: window.innerWidth,
    height: window.innerHeight - 90,
  };

  const [scale, setScale] = useState(1);
  const [image] = useImage(imageUrl ?? '');
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });

  // Закрытие контекстного меню при клике вне его
  useEffect(() => {
    const handleClickOutside = () => {
      setContextMenu(defaultContextMenu);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

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

  const handleRightClick = (e: any, type: string, currentObject?: any) => {
    e.evt.preventDefault();
    const stage = e.target.getStage();
    const pointer = stage.getPointerPosition();

    if (type === 'DEFAULT' && e.target.getClassName() !== 'Image') return;
    if (lines.length === 0) return;

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
      }
    }
  };

  // Завершение текущей ломаной линии
  const completeCurrentBrokenLine = () => {
    if (currentBrokenLine.length > 1) {
      setBrokenLines(prev => [...prev, currentBrokenLine]);
    }
    setCurrentBrokenLine([]);
  };

  const renderBrokenLines = () => {
    return (
      <>
        {/* Рендер всех сохраненных ломаных линий */}
        {brokenLines.map((line, lineIndex) => (
          <React.Fragment key={`broken-line-${lineIndex}`}>
            <Line
              points={line.flatMap(point => [
                point.x * scale + imagePosition.x,
                point.y * scale + imagePosition.y,
              ])}
              stroke='blue'
              strokeWidth={2}
            />
            {line.map((point, pointIndex) => (
              <Circle
                key={`point-${lineIndex}-${pointIndex}`}
                x={point.x * scale + imagePosition.x}
                y={point.y * scale + imagePosition.y}
                radius={4}
                fill='blue'
              />
            ))}
          </React.Fragment>
        ))}

        {/* Рендер текущей создаваемой ломаной линии */}
        {currentBrokenLine.length > 0 && (
          <>
            <Line
              points={currentBrokenLine.flatMap(point => [
                point.x * scale + imagePosition.x,
                point.y * scale + imagePosition.y,
              ])}
              stroke='blue'
              strokeWidth={2}
            />
            {currentBrokenLine.map((point, index) => (
              <Circle
                key={`current-point-${index}`}
                x={point.x * scale + imagePosition.x}
                y={point.y * scale + imagePosition.y}
                radius={4}
                fill='blue'
              />
            ))}
          </>
        )}
      </>
    );
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
            {selectedTool === 'broken-line' && <Layer>{renderBrokenLines()}</Layer>}
          </Stage>
        </div>
      ) : (
        <div>Пока ничего не выбрано...</div>
      )}

      {contextMenu.visible && (
        <ContextMenu
          contextMenu={contextMenu}
          setContextMenu={setContextMenu}
          setCurrentLinePoints={setCurrentLinePoints}
          // onClearBrokenLines={() => {
          //   setBrokenLines([]);
          //   setCurrentBrokenLine([]);
          // }}
          // onCompleteBrokenLine={completeCurrentBrokenLine}
        />
      )}
    </div>
  );
};
