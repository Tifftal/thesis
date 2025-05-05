import { ReactNode } from 'react';

import { IconColumns } from '@tabler/icons-react';

import { InputNote } from 'ui-kit/inputs/InputNote';

import './measurement-table.css';

type Props = {
  measurement: any;
  name: string | ReactNode;
  titles: string[];
  type: string;
};

export const MeasurementTable = (props: Props) => {
  const { measurement = [], name, titles, type } = props;

  const getCells = (item: any) => {
    switch (type) {
      case 'lines': {
        return (
          <>
            <td>
              ({item.line[0].x.toFixed(1)}, {item.line[0].y.toFixed(1)})
            </td>
            <td>
              ({item.line[1].x.toFixed(1)}, {item.line[1].y.toFixed(1)})
            </td>
          </>
        );
      }
      case 'brokenLines': {
        return (
          <>
            <td>
              ({item.brokenLine[0].x.toFixed(1)}, {item.brokenLine[0].y.toFixed(1)})
            </td>
            <td>
              ({item.brokenLine[item.brokenLine.length - 1].x.toFixed(1)},{' '}
              {item.brokenLine[item.brokenLine.length - 1].y.toFixed(1)})
            </td>
          </>
        );
      }
      case 'polygons': {
        return (
          <>
            <td>
              ({item.polygon[0].x.toFixed(1)}, {item.polygon[0].y.toFixed(1)})
            </td>
            <td>
              ({item.polygon[item.polygon.length - 1].x.toFixed(1)},{' '}
              {item.polygon[item.polygon.length - 1].y.toFixed(1)})
            </td>
          </>
        );
      }
      case 'rectangles': {
        return (
          <>
            <td>
              ({item.rectangle.x.toFixed(1)}, {item.rectangle.y.toFixed(1)})
            </td>
            <td>{item.rectangle.width.toFixed(1)}</td>
            <td>{item.rectangle.height.toFixed(1)}</td>
          </>
        );
      }
      case 'circles': {
        return (
          <>
            <td>
              ({item.circle.x.toFixed(1)}, {item.circle.y.toFixed(1)})
            </td>
            <td>{item.circle.radius.toFixed(1)}</td>
          </>
        );
      }
      case 'ellipses': {
        return (
          <>
            <td>
              ({item.ellipse.x.toFixed(1)}, {item.ellipse.y.toFixed(1)})
            </td>
            <td>{item.ellipse.radiusX.toFixed(1)}</td>
            <td>{item.ellipse.radiusY.toFixed(1)}</td>
          </>
        );
      }
      default:
        return null;
    }
  };

  return (
    <div>
      <div className='table__name'>
        <span>{name}</span>
        <IconColumns width={18} height={18} stroke={1.5} className='table__edit-columns-btn' />
      </div>
      <table className='table'>
        <thead>
          <tr>
            {titles.map((title, index) => (
              <th key={index}>{title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {measurement.map((item: any, index: number) => (
            <tr key={index}>
              {getCells(item)}
              <td className='table__input-note'>
                <InputNote placeholder='Примечание' value={item.note} onChange={() => {}} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
