import useStore from 'services/zustand/store';
import {
  BrokenLine,
  Circle,
  Ellipse,
  Line,
  Point,
  Polygon,
  Rectangle,
  SavedBrokenLine,
  SavedCircle,
  SavedEllipse,
  SavedLine,
  SavedPolygon,
  SavedRectangle,
  ZustandStoreStateType,
} from 'services/zustand/types';

import {
  calculateCircleArea,
  calculateDistance,
  calculateEllipseArea,
  calculatePolygonArea,
  calculatePolylineLength,
  calculateRectangleArea,
  calculateRectangleLength,
  getScaledCoord,
  getScaledNumber,
  getScaledParameter,
} from 'components/MainPage/helpers';
import { ChangeLayer } from 'pages/helpers';

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
    scaleFactor,
    selectedImage,
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
    const scaledLine: Line = contextMenu.currentObject.map((point: Point) =>
      getScaledCoord(point, scaleFactor),
    );

    const scaledDistance = calculateDistance(
      contextMenu.currentObject[0],
      contextMenu.currentObject[1],
      scaleFactor,
      selectedImage?.units,
    );

    const newLine: SavedLine = {
      line: scaledLine,
      distance: scaledDistance,
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
    const scaledBrokenLine: BrokenLine = contextMenu.currentObject.map((point: Point) =>
      getScaledCoord(point, scaleFactor),
    );

    const scaledDistance = calculatePolylineLength(
      contextMenu.currentObject,
      scaleFactor,
      selectedImage?.units,
    );

    const newBrokenLine: SavedBrokenLine = {
      brokenLine: scaledBrokenLine,
      distance: scaledDistance,
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
    const scaledPolygon: Polygon = contextMenu.currentObject.map((point: Point) =>
      getScaledCoord(point, scaleFactor),
    );

    const scaledDistance = calculatePolylineLength(
      contextMenu.currentObject,
      scaleFactor,
      selectedImage?.units,
    );

    const newPolygon: SavedPolygon = {
      polygon: scaledPolygon,
      perimeter: scaledDistance,
      area: calculatePolygonArea(contextMenu.currentObject, scaleFactor, selectedImage?.units),
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
    const scaledRectangle: Rectangle = {
      x: getScaledNumber(contextMenu.currentObject.x, scaleFactor),
      y: getScaledNumber(contextMenu.currentObject.y, scaleFactor),
      width: getScaledNumber(contextMenu.currentObject.width, scaleFactor),
      height: getScaledNumber(contextMenu.currentObject.height, scaleFactor),
    };

    const newRectangle: SavedRectangle = {
      rectangle: scaledRectangle,
      area: calculateRectangleLength(contextMenu.currentObject, scaleFactor, selectedImage?.units),
      perimeter: calculateRectangleArea(contextMenu.currentObject, scaleFactor, selectedImage?.units),
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

  const saveCircle = () => {
    const scaledCircle: Circle = {
      x: getScaledNumber(contextMenu.currentObject.x, scaleFactor),
      y: getScaledNumber(contextMenu.currentObject.y, scaleFactor),
      radius: getScaledNumber(contextMenu.currentObject.radius, scaleFactor),
    };

    const newCircle: SavedCircle = {
      circle: scaledCircle,
      area: calculateCircleArea(contextMenu.currentObject.radius, scaleFactor, selectedImage?.units),
      length: '0',
      note: '',
    };

    const newSavedCircles = [...(savedMeasurements?.circles || []), newCircle];
    const newMeasurements = {
      ...savedMeasurements,
      circles: newSavedCircles,
    };

    setSavedMeasurements(newMeasurements);
    closeContextMenu();
    closeContextMenu();
  };

  const saveEllipse = () => {
    const scaledEllipse: Ellipse = {
      x: getScaledNumber(contextMenu.currentObject.x, scaleFactor),
      y: getScaledNumber(contextMenu.currentObject.y, scaleFactor),
      radiusX: getScaledNumber(contextMenu.currentObject.radiusX, scaleFactor),
      radiusY: getScaledNumber(contextMenu.currentObject.radiusY, scaleFactor),
    };

    const newEllipse: SavedEllipse = {
      ellipse: scaledEllipse,
      area: calculateEllipseArea(
        contextMenu.currentObject.radiusX,
        contextMenu.currentObject.radiusY,
        scaleFactor,
        selectedImage?.units,
      ),
      length: '0',
      note: '',
    };

    const newSavedEllipses = [...(savedMeasurements?.ellipses || []), newEllipse];
    const newMeasurements = {
      ...savedMeasurements,
      ellipses: newSavedEllipses,
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
                  Общая длина:{' '}
                  {calculatePolylineLength(contextMenu.currentObject, scaleFactor, selectedImage?.units)}
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
                  Периметр:{' '}
                  {calculatePolylineLength(contextMenu.currentObject, scaleFactor, selectedImage?.units)}
                </div>
                <div className='context-menu__item' style={{ fontFamily: 'Inter Bold' }}>
                  Площадь:{' '}
                  {calculatePolygonArea(contextMenu.currentObject, scaleFactor, selectedImage?.units)}
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
              Периметр:{' '}
              {calculateRectangleLength(contextMenu.currentObject, scaleFactor, selectedImage?.units)}
            </div>
            <div className='context-menu__item' style={{ fontFamily: 'Inter Bold' }}>
              Площадь: {calculateRectangleArea(contextMenu.currentObject, scaleFactor, selectedImage?.units)}
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
              Радиус:{' '}
              {getScaledParameter(contextMenu.currentObject.radius, scaleFactor, selectedImage?.units, 1)}
            </div>
            <div className='context-menu__item' style={{ fontFamily: 'Inter Bold' }}>
              Площадь:{' '}
              {calculateCircleArea(contextMenu.currentObject.radius, scaleFactor, selectedImage?.units)}
            </div>
            <div className='context-menu__item' onClick={saveCircle}>
              Сохранить измерение
            </div>
            <div
              className='context-menu__item'
              onClick={() => handleClear('circles', 'Ошибка удаления окружности')}>
              Удалить окружность
            </div>
          </>
        );

      case 'ELLIPSE':
        const bigAxis =
          contextMenu.currentObject.radiusX > contextMenu.currentObject.radiusY
            ? contextMenu.currentObject.radiusX
            : contextMenu.currentObject.radiusY;

        const smallAxis =
          contextMenu.currentObject.radiusX <= contextMenu.currentObject.radiusY
            ? contextMenu.currentObject.radiusX
            : contextMenu.currentObject.radiusY;

        return (
          <>
            <div className='context-menu__item' style={{ fontFamily: 'Inter Bold' }}>
              Большая полуось: {getScaledParameter(bigAxis, scaleFactor, selectedImage?.units, 2)}
            </div>
            <div className='context-menu__item' style={{ fontFamily: 'Inter Bold' }}>
              Малая полуось: {getScaledParameter(smallAxis, scaleFactor, selectedImage?.units, 2)}
            </div>
            <div className='context-menu__item' style={{ fontFamily: 'Inter Bold' }}>
              Площадь:{' '}
              {calculateEllipseArea(
                contextMenu.currentObject.radiusX,
                contextMenu.currentObject.radiusY,
                scaleFactor,
                selectedImage?.units,
              )}
            </div>
            <div className='context-menu__item' onClick={saveEllipse}>
              Сохранить измерение
            </div>
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
