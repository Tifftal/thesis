import { useEffect, useState } from 'react';

import { Layer, Stage, Image, Circle, Text, Line } from 'react-konva';
import useImage from 'use-image';

import useStore from 'services/zustand/store';
import { ZustandStoreStateType } from 'services/zustand/types';

import Vreast from 'assets/images/mock/breast_cancer.jpg';

export const MainPage = () => {
  const { selectedImage } = useStore((state: ZustandStoreStateType) => state);

  const [imageUrl, setImageUrl] = useState<string>('');
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);

  const [scale, setScale] = useState(1);
  const [image] = useImage(imageUrl ?? '');
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [keyState, setKeyState] = useState({
    ctrl: false,
    meta: false,
  });

  const windowSize = {
    width: window.innerWidth,
    height: window.innerHeight - 90,
  };

  // useEffect(() => {
  //   const handleKeyDown = (e: KeyboardEvent) => {
  //     setKeyState({
  //       ctrl: e.ctrlKey,
  //       meta: e.metaKey,
  //     });
  //   };

  //   const handleKeyUp = (e: KeyboardEvent) => {
  //     setKeyState({
  //       ctrl: e.ctrlKey,
  //       meta: e.metaKey,
  //     });
  //   };

  //   window.addEventListener('keydown', handleKeyDown);
  //   window.addEventListener('keyup', handleKeyUp);

  //   return () => {
  //     window.removeEventListener('keydown', handleKeyDown);
  //     window.removeEventListener('keyup', handleKeyUp);
  //   };
  // }, []);

  // useEffect(() => {
  //   if (selectedImage) {
  //     const url = URL.createObjectURL(selectedImage);
  //     setImageUrl(Vreast);
  //     return () => URL.revokeObjectURL(url);
  //   }
  //   setImageUrl('');
  // }, [selectedImage]);

  // // Центрируем изображение при первой загрузке
  // useEffect(() => {
  //   if (image) {
  //     const x = (windowSize.width - image.width * scale) / 2;
  //     const y = (windowSize.height - image.height * scale) / 2;
  //     setImagePosition({ x, y });
  //   }
  // }, [image, windowSize]);

  // Обработчик колесика мыши
  const handleWheel = (e: any) => {
    e.evt.preventDefault();
    const container = document.querySelector('.main-page__image');
    if (!container) return;

    // Zoom при зажатом Ctrl
    if (keyState.ctrl) {
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

      setScale(Math.max(1, newScale));
      setImagePosition({ x: newX, y: newY });
    }
    // Горизонтальный скролл при зажатом Command (Meta)
    else if (keyState.meta) {
      container.scrollLeft += e.evt.deltaY;
    }
    // Обычный вертикальный скролл
    else {
      container.scrollTop += e.evt.deltaY;
    }
  };

  // Обработчик клика для создания точек
  const handleStageClick = (e: any) => {
    const stage = e.target.getStage();
    const pointer = stage.getPointerPosition();
    if (!pointer || !image) return;

    const x = (pointer.x - imagePosition.x) / scale;
    const y = (pointer.y - imagePosition.y) / scale;

    if (x >= 0 && y >= 0 && x <= image.width && y <= image.height) {
      const newPoint = { x, y };

      setPoints(prevPoints => {
        if (prevPoints.length === 2) {
          return [newPoint];
        }
        return [...prevPoints, newPoint];
      });
    }
  };

  const calculateDistance = () => {
    if (points.length !== 2) return null;

    const [p1, p2] = points;
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy).toFixed(2);
  };

  return (
    <div className='page__container main-page__container'>
      {selectedImage ? (
        <div className='main-page__image'>
          <Stage
            width={windowSize.width * 2}
            height={windowSize.height * 2}
            onClick={handleStageClick}
            onWheel={handleWheel}>
            <Layer>
              {image && (
                <Image image={image} x={imagePosition.x} y={imagePosition.y} scaleX={scale} scaleY={scale} />
              )}

              {points.map((point, index) => (
                <Circle
                  key={index}
                  x={point.x * scale + imagePosition.x}
                  y={point.y * scale + imagePosition.y}
                  radius={5}
                  fill='red'
                />
              ))}

              {points.length === 2 && (
                <>
                  <Line
                    points={[
                      points[0].x * scale + imagePosition.x,
                      points[0].y * scale + imagePosition.y,
                      points[1].x * scale + imagePosition.x,
                      points[1].y * scale + imagePosition.y,
                    ]}
                    stroke='red'
                    strokeWidth={2}
                  />
                  <Text
                    x={((points[0].x + points[1].x) / 2) * scale + imagePosition.x}
                    y={((points[0].y + points[1].y) / 2) * scale + imagePosition.y - 20}
                    text={`${calculateDistance()} px`}
                    fontSize={16}
                    fill='red'
                  />
                </>
              )}
            </Layer>
          </Stage>
        </div>
      ) : (
        <div>Пока ничего не выбрано...</div>
      )}
    </div>
  );
};
