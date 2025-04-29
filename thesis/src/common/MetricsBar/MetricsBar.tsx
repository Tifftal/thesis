import { useState } from 'react';

import { IconArrowBarToLeft, IconArrowBarToRight } from '@tabler/icons-react';

import useStore from 'services/zustand/store';
import { ZustandStoreStateType } from 'services/zustand/types';

import { Button } from 'ui-kit/button';
import { InputNote } from 'ui-kit/inputs/InputNote';

export const MetricsBar = () => {
  const [open, setOpen] = useState<boolean>(true);

  const { savedLines, setSavedLines, savedBrokenLines, setSavedBrokenLines } = useStore(
    (state: ZustandStoreStateType) => state,
  );

  const handleClearMetrics = () => {
    setSavedLines([]);
    setSavedBrokenLines([]);
  };

  return (
    <div className={`metrics-bar__container ${open ? 'open' : 'collapsed'}`}>
      <div className='metrics-bar__header'>
        {open ? <div className='metrics-bar__header__title'>Измерения</div> : null}
        <div className='metrics-bar__icon-wrapper' onClick={() => setOpen(state => !state)}>
          <IconArrowBarToRight
            className={`icon-transition ${open ? 'visible' : 'hidden'}`}
            stroke={1.4}
            color='var(--color-grey7)'
          />
          <IconArrowBarToLeft
            className={`icon-transition ${open ? 'hidden' : 'visible'}`}
            stroke={1.4}
            color='var(--color-grey7)'
          />
        </div>
      </div>
      {/*  TODO: тут разделить на две таблицы */}
      {savedLines.length === 0 ? (
        <div className={`metrics-bar__content__empty ${open ? '' : 'collapsed'}`}>
          Пока не добавлено измерений...
        </div>
      ) : (
        <div className={`metrics-bar__content ${open ? '' : 'collapsed'}`}>
          <table className='table'>
            <thead>
              <tr>
                <th>Начальная точка</th>
                <th>Конечная точка</th>
                <th>Расстояние</th>
                <th>Примечание</th>
              </tr>
            </thead>
            <tbody>
              {savedLines.map((savedLine, index) => (
                <tr key={index}>
                  <td>
                    ({savedLine.line[0].x.toFixed(1)}, {savedLine.line[0].y.toFixed(1)})
                  </td>
                  <td>
                    ({savedLine.line[1].x.toFixed(1)}, {savedLine.line[1].y.toFixed(1)})
                  </td>
                  <td>{savedLine.distance} нм</td>
                  <td className='table__input-note'>
                    <InputNote placeholder='Примечание' value={savedLine.note} onChange={() => {}} />
                  </td>
                </tr>
              ))}
              {savedBrokenLines.map((savedLine, index) => (
                <tr key={index}>
                  <td>
                    ({savedLine.brokenLine[0].x.toFixed(1)}, {savedLine.brokenLine[0].y.toFixed(1)})
                  </td>
                  <td>
                    ({savedLine.brokenLine[savedLine.brokenLine.length - 1].x.toFixed(1)},{' '}
                    {savedLine.brokenLine[savedLine.brokenLine.length - 1].y.toFixed(1)})
                  </td>
                  <td>{savedLine.distance} нм</td>
                  <td className='table__input-note'>
                    <InputNote placeholder='Примечание' value={savedLine.note} onChange={() => {}} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className='metrics-bar__actions'>
            <Button size='s' stretched>
              Скачать CSV
            </Button>
            <Button size='s' type='grey' stretched onClick={handleClearMetrics}>
              Очистить
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
