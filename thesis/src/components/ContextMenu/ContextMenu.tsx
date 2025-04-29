import useStore from 'services/zustand/store';
import { Point, SavedBrokenLine, SavedLine, ZustandStoreStateType } from 'services/zustand/types';

import { ChangeLayer } from 'pages/changeDataHelpers';

import {
  calculateDistance,
  calculatePolygonArea,
  calculatePolylineLength,
  calculateRectangleArea,
  calculateRectangleLength,
} from 'pages/MainPage/helpers';

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
    savedLines,
    setSavedLines,
    savedBrokenLines,
    setSavedBrokenLines,
    selectedLayer,
    setSelectedLayer,
    visibleLayers,
    setVisibleLayers,
    selectedProject,
    setSelectedProject,
  } = useStore((state: ZustandStoreStateType) => state);

  const { onMessage } = useToast();

  const handleClear = (object: string, error: string) => {
    if (!contextMenu.currentObject) return;

    const newMeasurements = selectedLayer?.measurements || {};

    if (!newMeasurements[object]) {
      newMeasurements[object] = [];
    }

    newMeasurements[object] = newMeasurements[object].filter(
      (line: Point[]) => JSON.stringify(line) !== JSON.stringify(contextMenu.currentObject),
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
    const newSavedLines = [...savedLines, newLine];

    setSavedLines(newSavedLines);
    closeContextMenu();
  };

  const saveBrokenLine = () => {
    const newBrokenLine: SavedBrokenLine = {
      brokenLine: contextMenu.currentObject,
      distance: `${calculatePolylineLength(contextMenu.currentObject).toFixed(2)}`,
      note: '',
    };

    const newSavedBrokenLines = [...savedBrokenLines, newBrokenLine];

    setSavedBrokenLines(newSavedBrokenLines);
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
                <div className='context-menu__item'>Сохранить измерение</div>
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
            <div className='context-menu__item'>Сохранить измерение</div>
            <div
              className='context-menu__item'
              onClick={() => handleClear('rectangles', 'Ошибка удаления прямоугольника')}>
              Удалить прямоугольник
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
