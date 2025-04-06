import useStore from 'services/zustand/store';
import { Point, SavedLine, ZustandStoreStateType } from 'services/zustand/types';

import { defaultContextMenu } from 'pages/MainPage/constants';

import { calculateDistance } from 'pages/MainPage/helpers';

type Props = {
  contextMenu: { type: string; visible: boolean; x: number; y: number; currentObject: any };
  setContextMenu: (value: {
    type: string;
    visible: boolean;
    x: number;
    y: number;
    currentObject: any;
  }) => void;
  setCurrentLinePoints: (value: Point[]) => void;
};

export const ContextMenu = (props: Props) => {
  const { contextMenu, setContextMenu, setCurrentLinePoints } = props;

  const { lines, setLines, setSavedLines, savedLines } = useStore((state: ZustandStoreStateType) => state);

  const handleClearLine = () => {
    if (!contextMenu.currentObject) return;

    const newLines = lines.filter(line => JSON.stringify(line) !== JSON.stringify(contextMenu.currentObject));
    setLines(newLines);

    setContextMenu(defaultContextMenu);
  };

  const handleClearAll = () => {
    setLines([]);
    setCurrentLinePoints([]);
    setContextMenu(defaultContextMenu);
  };

  const saveLine = () => {
    const newLine: SavedLine = {
      line: contextMenu.currentObject,
      distance: `${calculateDistance(contextMenu.currentObject[0], contextMenu.currentObject[1])}`,
      note: '',
    };
    const newSavedLines = [...savedLines, newLine];

    setSavedLines(newSavedLines);
    setContextMenu(defaultContextMenu);
  };

  const saveAll = () => {
    const newSavedLines = lines.map(item => ({
      line: item,
      distance: `${calculateDistance(item[0], item[1])}`,
      note: '',
    }));

    setSavedLines(newSavedLines);
    setContextMenu(defaultContextMenu);
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
