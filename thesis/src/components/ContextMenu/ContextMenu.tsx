import useStore from 'services/zustand/store';
import {
  Point,
  SavedBrokenLine,
  SavedLine,
  SavedPolygon,
  SavedRectangle,
  ZustandStoreStateType,
} from 'services/zustand/types';

import { ChangeLayer } from 'pages/changeDataHelpers';

import {
  calculateCircleArea,
  calculateDistance,
  calculateEllipseArea,
  calculatePolygonArea,
  calculatePolylineLength,
  calculateRectangleArea,
  calculateRectangleLength,
} from 'components/MainPage/helpers';

import useToast from 'utils/hooks/useToast';

type Props = {
  contextMenu: { type: string; visible: boolean; x: number; y: number; currentObject: any };
  closeContextMenu: () => void;
  setCurrentLinePoints: (value: Point[]) => void;
  setCurrentBrokenLine: (value: Point[]) => void;
  onCompleteBrokenLine: () => void;
  onCompletePolygon: () => void;
};

export const ContextMenu = (props: Props) => {
  const { contextMenu, closeContextMenu, onCompleteBrokenLine, onCompletePolygon } = props;

  const {
    selectedLayer,
    setSelectedLayer,
    visibleLayers,
    setVisibleLayers,
    selectedProject,
    setSelectedProject,
    savedMeasurements,
    setSavedMeasurements,
  } = useStore((state: ZustandStoreStateType) => state);

  const { onMessage } = useToast();

  const handleClear = (object: string, error: string) => {
    if (!contextMenu.currentObject) return;

    const newMeasurements = selectedLayer?.measurements || {};

    if (!newMeasurements[object]) {
      newMeasurements[object] = [];
    }

    newMeasurements[object] = newMeasurements[object].filter(
      (object: any) => JSON.stringify(object) !== JSON.stringify(contextMenu.currentObject),
    );

    ChangeLayer(
      selectedProject,
      setSelectedProject,
      selectedLayer,
      setSelectedLayer,
      visibleLayers,
      setVisibleLayers,
      newMeasurements,
      onMessage,
      error,
    );

    closeContextMenu();
  };

  const saveLine = () => {
    const newLine: SavedLine = {
      line: contextMenu.currentObject,
      distance: `${calculateDistance(contextMenu.currentObject[0], contextMenu.currentObject[1])}`,
      note: '',
    };
    const newSavedLines = [...(savedMeasurements?.lines || []), newLine];
    const newMeasurements = {
      ...savedMeasurements,
      lines: newSavedLines,
    };

    setSavedMeasurements(newMeasurements);
    closeContextMenu();
  };

  const saveBrokenLine = () => {
    const newBrokenLine: SavedBrokenLine = {
      brokenLine: contextMenu.currentObject,
      distance: `${calculatePolylineLength(contextMenu.currentObject).toFixed(2)}`,
      note: '',
    };

    const newSavedBrokenLines = [...(savedMeasurements?.brokenLines || []), newBrokenLine];
    const newMeasurements = {
      ...savedMeasurements,
      brokenLines: newSavedBrokenLines,
    };

    setSavedMeasurements(newMeasurements);
    closeContextMenu();
    closeContextMenu();
  };

  const savePolygon = () => {
    const newPolygon: SavedPolygon = {
      polygon: contextMenu.currentObject,
      perimeter: `${calculatePolylineLength(contextMenu.currentObject).toFixed(1)}`,
      area: `${calculatePolygonArea(contextMenu.currentObject).toFixed(1)}`,
      note: '',
    };

    const newSavedPolygons = [...(savedMeasurements?.polygons || []), newPolygon];
    const newMeasurements = {
      ...savedMeasurements,
      polygons: newSavedPolygons,
    };

    setSavedMeasurements(newMeasurements);
    closeContextMenu();
    closeContextMenu();
  };

  const saveRectangle = () => {
    const newRectangle: SavedRectangle = {
      rectangle: contextMenu.currentObject,
      area: `${calculateRectangleLength(contextMenu.currentObject).toFixed(1)}`,
      perimeter: `${calculateRectangleArea(contextMenu.currentObject).toFixed(1)}`,
      note: '',
    };

    const newSavedRectangles = [...(savedMeasurements?.rectangles || []), newRectangle];
    const newMeasurements = {
      ...savedMeasurements,
      rectangles: newSavedRectangles,
    };

    setSavedMeasurements(newMeasurements);
    closeContextMenu();
    closeContextMenu();
  };

  const renderContent = () => {
    switch (contextMenu.type) {
      case 'LINE':
        return (
          <>
            <div className='context-menu__item' onClick={saveLine}>
              Сохранить измерение
            </div>
            <div className='context-menu__item' onClick={() => handleClear('lines', 'Ошибка удаления линии')}>
              Удалить прямую
            </div>
          </>
        );

      case 'BROKEN_LINE':
        return (
          <>
            {!contextMenu.currentObject && (
              <div className='context-menu__item' onClick={onCompleteBrokenLine}>
                Завершить ломаную
              </div>
            )}
            {contextMenu.currentObject && (
              <>
                <div className='context-menu__item' style={{ fontFamily: 'Inter Bold' }}>
                  Общая длина: {calculatePolylineLength(contextMenu.currentObject).toFixed(2)}
                </div>
                <div className='context-menu__item' onClick={saveBrokenLine}>
                  Сохранить измерение
                </div>
              </>
            )}

            <div
              className='context-menu__item'
              onClick={() => handleClear('brokenLines', 'Ошибка удаления ломаной')}>
              Удалить ломаную
            </div>
          </>
        );
      case 'POLYGON':
        return (
          <>
            {!contextMenu.currentObject && (
              <div className='context-menu__item' onClick={onCompletePolygon}>
                Завершить многоугольник
              </div>
            )}
            {contextMenu.currentObject && (
              <>
                <div className='context-menu__item' style={{ fontFamily: 'Inter Bold' }}>
                  Периметр: {calculatePolylineLength(contextMenu.currentObject).toFixed(2)}
                </div>
                <div className='context-menu__item' style={{ fontFamily: 'Inter Bold' }}>
                  Площадь: {calculatePolygonArea(contextMenu.currentObject).toFixed(2)}
                </div>
                <div className='context-menu__item' onClick={savePolygon}>
                  Сохранить измерение
                </div>
              </>
            )}

            <div
              className='context-menu__item'
              onClick={() => handleClear('polygons', 'Ошибка удаления многоугольника')}>
              Удалить многоугольник
            </div>
          </>
        );

      case 'RECTANGLE':
        return (
          <>
            <div className='context-menu__item' style={{ fontFamily: 'Inter Bold' }}>
              Периметр: {calculateRectangleLength(contextMenu.currentObject).toFixed(2)}
            </div>
            <div className='context-menu__item' style={{ fontFamily: 'Inter Bold' }}>
              Площадь: {calculateRectangleArea(contextMenu.currentObject).toFixed(2)}
            </div>
            <div className='context-menu__item' onClick={saveRectangle}>
              Сохранить измерение
            </div>
            <div
              className='context-menu__item'
              onClick={() => handleClear('rectangles', 'Ошибка удаления прямоугольника')}>
              Удалить прямоугольник
            </div>
          </>
        );

      case 'CIRCLE':
        return (
          <>
            <div className='context-menu__item' style={{ fontFamily: 'Inter Bold' }}>
              Радиус: {contextMenu.currentObject.radius.toFixed(2)}
            </div>
            <div className='context-menu__item' style={{ fontFamily: 'Inter Bold' }}>
              Площадь: {calculateCircleArea(contextMenu.currentObject.radius).toFixed(2)}
            </div>
            <div className='context-menu__item'>Сохранить измерение</div>
            <div
              className='context-menu__item'
              onClick={() => handleClear('circles', 'Ошибка удаления окружности')}>
              Удалить окружность
            </div>
          </>
        );

      case 'ELLIPSE':
        return (
          <>
            <div className='context-menu__item' style={{ fontFamily: 'Inter Bold' }}>
              Большая полуось:{' '}
              {contextMenu.currentObject.radiusX > contextMenu.currentObject.radiusY
                ? contextMenu.currentObject.radiusX.toFixed(2)
                : contextMenu.currentObject.radiusY.toFixed(2)}
            </div>
            <div className='context-menu__item' style={{ fontFamily: 'Inter Bold' }}>
              Малая полуось:{' '}
              {contextMenu.currentObject.radiusX < contextMenu.currentObject.radiusY
                ? contextMenu.currentObject.radiusX.toFixed(2)
                : contextMenu.currentObject.radiusY.toFixed(2)}
            </div>
            <div className='context-menu__item' style={{ fontFamily: 'Inter Bold' }}>
              Площадь:{' '}
              {calculateEllipseArea(
                contextMenu.currentObject.radiusX,
                contextMenu.currentObject.radiusY,
              ).toFixed(2)}
            </div>
            <div className='context-menu__item'>Сохранить измерение</div>
            <div
              className='context-menu__item'
              onClick={() => handleClear('ellipses', 'Ошибка удаления эллипса')}>
              Удалить эллипс
            </div>
          </>
        );
      default:
        return <></>;
    }
  };

  return (
    <div
      className='context-menu__container'
      style={{ top: contextMenu.y, left: contextMenu.x }}
      onClick={e => e.stopPropagation()}>
      {renderContent()}
    </div>
  );
};
