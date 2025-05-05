import { useState } from 'react';

import { IconArrowBarToLeft, IconArrowBarToRight, IconInfoCircle } from '@tabler/icons-react';

import useStore from 'services/zustand/store';
import { ZustandStoreStateType } from 'services/zustand/types';

import { Button } from 'ui-kit/button';
import { Tooltip } from 'ui-kit/tooltip';

import { MeasurementTable } from './MeasurementTable/MeasurementTable';

export const MetricsBar = () => {
  const [open, setOpen] = useState<boolean>(true);

  const { savedMeasurements, setSavedMeasurements } = useStore((state: ZustandStoreStateType) => state);

  const handleClearMetrics = () => {
    setSavedMeasurements(null);
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
      <div className={`metrics-bar__container__content ${open ? '' : 'collapsed'}`}>
        {!savedMeasurements ? (
          <div className={`metrics-bar__content__empty ${open ? '' : 'collapsed'}`}>
            Пока не добавлено измерений...
          </div>
        ) : (
          <div className='metrics-bar__content'>
            <div className='metrics-bar__content__tables'>
              {savedMeasurements.lines && (
                <MeasurementTable
                  type='lines'
                  measurement={savedMeasurements.lines}
                  name='Прямые'
                  titles={['Начальная точка', 'Конечная точка', 'Примечание']}
                />
              )}
              {savedMeasurements.brokenLines && (
                <MeasurementTable
                  type='brokenLines'
                  measurement={savedMeasurements.brokenLines}
                  name={
                    <div className='metrics-bar__table__label'>
                      Ломаные
                      <Tooltip
                        title={
                          'В таблице приведены начальная и конечные точки, в .csv выгружаются все точки'
                        }>
                        <IconInfoCircle width={18} height={18} stroke={1.5} />
                      </Tooltip>
                    </div>
                  }
                  titles={['Начальная точка', 'Конечная точка', 'Примечание']}
                />
              )}
              {savedMeasurements.polygons && (
                <MeasurementTable
                  type='polygons'
                  measurement={savedMeasurements.polygons}
                  name={
                    <div className='metrics-bar__table__label'>
                      Многоугольники
                      <Tooltip
                        title={
                          'В таблице приведены начальная и конечные точки, в .csv выгружаются все точки'
                        }>
                        <IconInfoCircle width={18} height={18} stroke={1.5} />
                      </Tooltip>
                    </div>
                  }
                  titles={['Начальная точка', 'Конечная точка', 'Примечание']}
                />
              )}
              {savedMeasurements.rectangles && (
                <MeasurementTable
                  type='rectangles'
                  measurement={savedMeasurements.rectangles}
                  name='Прямоугольники'
                  titles={['Начальная точка', 'Ширина', 'Высота', 'Примечание']}
                />
              )}
              {savedMeasurements.circles && (
                <MeasurementTable
                  type='circles'
                  measurement={savedMeasurements.circles}
                  name='Окружности'
                  titles={['Центр', 'Радиус', 'Примечание']}
                />
              )}
              {savedMeasurements.ellipses && (
                <MeasurementTable
                  type='ellipses'
                  measurement={savedMeasurements.ellipses}
                  name='Эллипсы'
                  titles={['Центр', 'Полуось X', 'Полуось Y', 'Примечание']}
                />
              )}
            </div>
          </div>
        )}
        <div className='metrics-bar__actions'>
          <Button size='s' stretched>
            Скачать CSV
          </Button>
          <Button size='s' type='grey' stretched onClick={handleClearMetrics}>
            Очистить все
          </Button>
        </div>
      </div>
    </div>
  );
};
