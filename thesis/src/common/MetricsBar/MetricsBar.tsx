import { useState } from 'react';

import { IconArrowBarToLeft, IconArrowBarToRight } from '@tabler/icons-react';

import { Button } from 'ui-kit/button';
import { InputNote } from 'ui-kit/inputs/InputNote';

export const MetricsBar = () => {
  const [open, setOpen] = useState<boolean>(true);

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
            <tr>
              <td>(10.3, 11.5)</td>
              <td>(18.3, 11.9)</td>
              <td>18 нм</td>
              <td className='table__input-note'>
                <InputNote placeholder='Примечание' value={undefined} onChange={() => {}} />
              </td>
            </tr>
            <tr>
              <td>(10.3, 11.5)</td>
              <td>(18.3, 11.9)</td>
              <td>18 нм</td>
              <td className='table__input-note'>
                <InputNote placeholder='Примечание' value={undefined} onChange={() => {}} />
              </td>
            </tr>
            <tr>
              <td>(10.3, 11.5)</td>
              <td>(18.3, 11.9)</td>
              <td>18 нм</td>
              <td className='table__input-note'>
                <InputNote placeholder='Примечание' value={undefined} onChange={() => {}} />
              </td>
            </tr>
          </tbody>
        </table>
        {/* <div className='metrics-bar__content__empty'>Пока не добавлено измерений...</div> */}
        <div className='metrics-bar__actions'>
          <Button size='s' stretched>
            Скачать CSV
          </Button>
          <Button size='s' type='grey' stretched>
            Очистить
          </Button>
        </div>
      </div>
    </div>
  );
};
