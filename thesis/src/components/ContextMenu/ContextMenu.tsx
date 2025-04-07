import useStore from 'services/zustand/store';
import { Point, SavedBrokenLine, SavedLine, ZustandStoreStateType } from 'services/zustand/types';

import { calculateDistance, calculatePolylineLength } from 'pages/MainPage/helpers';

type Props = {
  contextMenu: { type: string; visible: boolean; x: number; y: number; currentObject: any };
  closeContextMenu: () => void;
  setCurrentLinePoints: (value: Point[]) => void;
  setCurrentBrokenLine: (value: Point[]) => void;
  onCompleteBrokenLine: () => void;
  onCompletePolygon: () => void;
};

export const ContextMenu = (props: Props) => {
  const {
    contextMenu,
    closeContextMenu,
    setCurrentLinePoints,
    setCurrentBrokenLine,
    onCompleteBrokenLine,
    onCompletePolygon,
  } = props;

  const {
    lines,
    setLines,
    savedLines,
    setSavedLines,
    brokenLines,
    setBrokenLines,
    savedBrokenLines,
    setSavedBrokenLines,
  } = useStore((state: ZustandStoreStateType) => state);

  const handleClearBrokenLine = () => {
    if (contextMenu.currentObject) {
      const newBrokenLines = brokenLines.filter(
        line => JSON.stringify(line) !== JSON.stringify(contextMenu.currentObject),
      );
      setBrokenLines(newBrokenLines);
    } else {
      setCurrentBrokenLine([]);
    }

    closeContextMenu();
  };
  const handleClearLine = () => {
    if (!contextMenu.currentObject) return;

    const newLines = lines.filter(line => JSON.stringify(line) !== JSON.stringify(contextMenu.currentObject));
    setLines(newLines);

    closeContextMenu();
  };

  const handleClearAll = () => {
    setLines([]);
    setCurrentLinePoints([]);
    setBrokenLines([]);
    setCurrentBrokenLine([]);
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

  const saveAll = () => {
    const newSavedLines = lines.map(item => ({
      line: item,
      distance: `${calculateDistance(item[0], item[1])}`,
      note: '',
    }));

    setSavedLines(newSavedLines);
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
            <div className='context-menu__item' onClick={handleClearLine}>
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

            <div className='context-menu__item' onClick={handleClearBrokenLine}>
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
                {/* <div className='context-menu__item' style={{ fontFamily: 'Inter Bold' }}>
                  Общая длина: {calculatePolylineLength(contextMenu.currentObject).toFixed(2)}
                </div> */}
                <div className='context-menu__item'>Сохранить измерение</div>
              </>
            )}

            <div className='context-menu__item'>Удалить многоугольник</div>
          </>
        );
      default:
        return (
          <>
            <div className='context-menu__item' onClick={saveAll}>
              Сохранить все измерения
            </div>
            <div className='context-menu__item' onClick={handleClearAll}>
              Очистить
            </div>
          </>
        );
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
