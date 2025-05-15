import useStore from 'services/zustand/store';
import { Point, ZustandStoreStateType } from 'services/zustand/types';

import {
  calculateCircleArea,
  calculateCircumference,
  calculateEllipseArea,
  calculateEllipseCircumference,
  calculatePolygonArea,
  calculatePolylineLength,
  calculateRectangleArea,
  calculateRectangleLength,
  getScaledParameter,
} from 'components/MainPage/helpers';
import { ChangeLayer } from 'pages/helpers';
import {
  getSavedBrokenLine,
  getSavedCircle,
  getSavedEllipse,
  getSavedLine,
  getSavedPolygon,
  getSavedRectangle,
} from 'utils/helpers';

import useToast from 'utils/hooks/useToast';

type Props = {
  contextMenu: { type: string; visible: boolean; x: number; y: number; currentObject: any };
  closeContextMenu: () => void;
  setCurrentLinePoints: (value: Point[]) => void;
  setCurrentBrokenLine: (value: Point[]) => void;
  onCompleteBrokenLine: () => void;
  onCompletePolygon: () => void;
  onClearCurrentPolygon: () => void;
  onClearCurrentBrokenLine: () => void;
};

export const ContextMenu = (props: Props) => {
  const {
    contextMenu,
    closeContextMenu,
    onCompleteBrokenLine,
    onCompletePolygon,
    onClearCurrentPolygon,
    onClearCurrentBrokenLine,
  } = props;

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
    setIsOpenAddObjectModal,
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
    if (!selectedImage?.id) return;
    const newLine = getSavedLine(
      contextMenu.currentObject,
      scaleFactor,
      onMessage,
      savedMeasurements,
      selectedImage,
      closeContextMenu,
    );

    if (!newLine) return;

    const newSavedLines = [...(savedMeasurements?.[selectedImage?.id]?.lines || []), newLine];

    const newMeasurements = {
      ...savedMeasurements,
      [selectedImage?.id]: {
        ...savedMeasurements?.[selectedImage?.id],
        lines: newSavedLines,
      },
    };

    setSavedMeasurements(newMeasurements);
    closeContextMenu();
  };

  const saveBrokenLine = () => {
    if (!selectedImage?.id) return;

    const newBrokenLine = getSavedBrokenLine(
      contextMenu.currentObject,
      scaleFactor,
      onMessage,
      savedMeasurements,
      selectedImage,
      closeContextMenu,
    );

    if (!newBrokenLine) return;

    const newSavedBrokenLines = [
      ...(savedMeasurements?.[selectedImage?.id]?.brokenLines || []),
      newBrokenLine,
    ];

    const newMeasurements = {
      ...savedMeasurements,
      [selectedImage?.id]: {
        ...savedMeasurements?.[selectedImage?.id],
        brokenLines: newSavedBrokenLines,
      },
    };

    setSavedMeasurements(newMeasurements);
    closeContextMenu();
  };

  const savePolygon = () => {
    if (!selectedImage?.id) return;

    const newPolygon = getSavedPolygon(
      contextMenu.currentObject,
      scaleFactor,
      onMessage,
      savedMeasurements,
      selectedImage,
      closeContextMenu,
    );

    if (!newPolygon) return;

    const newSavedPolygons = [...(savedMeasurements?.[selectedImage?.id]?.polygons || []), newPolygon];

    const newMeasurements = {
      ...savedMeasurements,
      [selectedImage?.id]: {
        ...savedMeasurements?.[selectedImage?.id],
        polygons: newSavedPolygons,
      },
    };

    setSavedMeasurements(newMeasurements);
    closeContextMenu();
  };

  const saveRectangle = () => {
    if (!selectedImage?.id) return;

    const newRectangle = getSavedRectangle(
      contextMenu.currentObject,
      scaleFactor,
      onMessage,
      savedMeasurements,
      selectedImage,
      closeContextMenu,
    );

    if (!newRectangle) return;

    const newSavedRectangles = [...(savedMeasurements?.[selectedImage?.id]?.rectangles || []), newRectangle];

    const newMeasurements = {
      ...savedMeasurements,
      [selectedImage?.id]: {
        ...savedMeasurements?.[selectedImage?.id],
        rectangles: newSavedRectangles,
      },
    };

    setSavedMeasurements(newMeasurements);
    closeContextMenu();
  };

  const saveCircle = () => {
    if (!selectedImage?.id) return;

    const newCircle = getSavedCircle(
      contextMenu.currentObject,
      scaleFactor,
      onMessage,
      savedMeasurements,
      selectedImage,
      closeContextMenu,
    );

    if (!newCircle) return;

    const newSavedCircles = [...(savedMeasurements?.[selectedImage?.id]?.circles || []), newCircle];

    const newMeasurements = {
      ...savedMeasurements,
      [selectedImage?.id]: {
        ...savedMeasurements?.[selectedImage?.id],
        circles: newSavedCircles,
      },
    };

    setSavedMeasurements(newMeasurements);
    closeContextMenu();
  };

  const saveEllipse = () => {
    if (!selectedImage?.id) return;

    const newEllipse = getSavedEllipse(
      contextMenu.currentObject,
      scaleFactor,
      onMessage,
      savedMeasurements,
      selectedImage,
      closeContextMenu,
    );

    if (!newEllipse) return;

    const newSavedEllipses = [...(savedMeasurements?.[selectedImage?.id]?.ellipses || []), newEllipse];

    const newMeasurements = {
      ...savedMeasurements,
      [selectedImage?.id]: {
        ...savedMeasurements?.[selectedImage?.id],
        ellipses: newSavedEllipses,
      },
    };

    setSavedMeasurements(newMeasurements);
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
              <>
                <div className='context-menu__item' onClick={onCompleteBrokenLine}>
                  Завершить ломаную
                </div>
                <div
                  className='context-menu__item'
                  onClick={() => {
                    onClearCurrentBrokenLine();
                    closeContextMenu();
                  }}>
                  Удалить ломаную
                </div>
              </>
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
                <div
                  className='context-menu__item'
                  onClick={() => handleClear('brokenLines', 'Ошибка удаления ломаной')}>
                  Удалить ломаную
                </div>
              </>
            )}
          </>
        );
      case 'POLYGON':
        return (
          <>
            {!contextMenu.currentObject && (
              <>
                <div className='context-menu__item' onClick={onCompletePolygon}>
                  Завершить многоугольник
                </div>
                <div
                  className='context-menu__item'
                  onClick={() => {
                    onClearCurrentPolygon();
                    closeContextMenu();
                  }}>
                  Удалить многоугольник
                </div>
              </>
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
                <div
                  className='context-menu__item'
                  onClick={() => handleClear('polygons', 'Ошибка удаления многоугольника')}>
                  Удалить многоугольник
                </div>
              </>
            )}
          </>
        );

      case 'GENERATED_POLYGON':
        return (
          <>
            <div className='context-menu__item' style={{ fontFamily: 'Inter Bold' }}>
              Периметр:{' '}
              {calculatePolylineLength(contextMenu.currentObject, scaleFactor, selectedImage?.units)}
            </div>
            <div className='context-menu__item' style={{ fontFamily: 'Inter Bold' }}>
              Площадь: {calculatePolygonArea(contextMenu.currentObject, scaleFactor, selectedImage?.units)}
            </div>

            <div
              className='context-menu__item'
              onClick={() =>
                setIsOpenAddObjectModal({ visible: true, selectedObject: contextMenu.currentObject })
              }>
              Использовать измерение на слое
            </div>
            <div className='context-menu__item' onClick={savePolygon}>
              Сохранить измерение
            </div>

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
              Длина:{' '}
              {calculateCircumference(contextMenu.currentObject.radius, scaleFactor, selectedImage?.units)}
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
              Длина:{' '}
              {calculateEllipseCircumference(
                contextMenu.currentObject.radiusX,
                contextMenu.currentObject.radiusY,
                scaleFactor,
                selectedImage?.units,
              )}
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
