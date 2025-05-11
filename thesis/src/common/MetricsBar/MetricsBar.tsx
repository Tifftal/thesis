/* eslint-disable complexity */
import { useState } from 'react';

import { IconArrowBarToLeft, IconArrowBarToRight, IconInfoCircle } from '@tabler/icons-react';
import { handleDownloadCSVByType, handleDownloadCSVInZIP } from 'utils/csvConverter/convertToCSV';

import useStore from 'services/zustand/store';
import { ZustandStoreStateType } from 'services/zustand/types';

import { Button } from 'ui-kit/button';
import { Tooltip } from 'ui-kit/tooltip';

import {
  defaultBrokenLineTableColumns,
  defaultCirclesTableColumns,
  defaultEllipsesTableColumns,
  defaultLineTableColumns,
  defaultPolygonTableColumns,
  defaultRectanglesTableColumns,
} from './constants';

import { MeasurementTable } from './MeasurementTable/MeasurementTable';

import useToast from 'utils/hooks/useToast';

export const MetricsBar = () => {
  const [open, setOpen] = useState<boolean>(true);

  const { savedMeasurements, setSavedMeasurements, selectedImage } = useStore(
    (state: ZustandStoreStateType) => state,
  );

  const { onMessage } = useToast();

  const handleClearMetrics = () => {
    setSavedMeasurements({ ...(savedMeasurements || []), [`${selectedImage?.id}`]: null });
  };

  const handleDownloadCSVForAll = () => {
    if (!selectedImage || !savedMeasurements) {
      onMessage('Нет данных для экспорта', 'warning', 'Ошибка');
      return;
    }

    onMessage('Идет подготовка архива...', 'warning', 'Экспорт данных');
    setTimeout(() => {
      handleDownloadCSVInZIP(selectedImage, savedMeasurements[selectedImage.id] || {})
        .then(() => onMessage('Архив успешно создан', 'success', 'Готово'))
        .catch(error => {
          onMessage(`Ошибка при создании архива ${error}`, 'error', 'Ошибка');
        });
    }, 500);
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
              {selectedImage?.id && savedMeasurements[selectedImage?.id]?.lines && (
                <MeasurementTable
                  type='lines'
                  measurement={savedMeasurements[selectedImage?.id].lines}
                  name='Прямые'
                  defaultColumns={defaultLineTableColumns}
                />
              )}
              {selectedImage?.id && savedMeasurements[selectedImage?.id]?.brokenLines && (
                <MeasurementTable
                  type='brokenLines'
                  measurement={savedMeasurements[selectedImage?.id].brokenLines}
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
                  defaultColumns={defaultBrokenLineTableColumns}
                />
              )}
              {selectedImage?.id && savedMeasurements[selectedImage?.id]?.polygons && (
                <MeasurementTable
                  type='polygons'
                  measurement={savedMeasurements[selectedImage?.id].polygons}
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
                  defaultColumns={defaultPolygonTableColumns}
                />
              )}
              {selectedImage?.id && savedMeasurements[selectedImage?.id]?.rectangles && (
                <MeasurementTable
                  type='rectangles'
                  measurement={savedMeasurements[selectedImage?.id].rectangles}
                  name='Прямоугольники'
                  defaultColumns={defaultRectanglesTableColumns}
                />
              )}
              {selectedImage?.id && savedMeasurements[selectedImage?.id]?.circles && (
                <MeasurementTable
                  type='circles'
                  measurement={savedMeasurements[selectedImage?.id].circles}
                  name='Окружности'
                  defaultColumns={defaultCirclesTableColumns}
                />
              )}
              {selectedImage?.id && savedMeasurements[selectedImage?.id]?.ellipses && (
                <MeasurementTable
                  type='ellipses'
                  measurement={savedMeasurements[selectedImage?.id].ellipses}
                  name='Эллипсы'
                  defaultColumns={defaultEllipsesTableColumns}
                />
              )}
            </div>
          </div>
        )}
        <div className='metrics-bar__actions'>
          <Button size='s' stretched onClick={handleDownloadCSVForAll}>
            Скачать все CSV
          </Button>
          <Button size='s' type='grey' stretched onClick={handleClearMetrics}>
            Очистить все
          </Button>
        </div>
      </div>
    </div>
  );
};
