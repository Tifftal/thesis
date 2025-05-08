/* eslint-disable complexity */
import { ReactNode, useState } from 'react';

import { IconDownload } from '@tabler/icons-react';

import { InputNote } from 'ui-kit/inputs/InputNote';

import './measurement-table.css';
import { ColumnSelect } from '../ColumnSelect/ColumnSelect';

import { TableColumnsType } from './types';

type Props = {
  measurement: any;
  name: string | ReactNode;
  defaultColumns: TableColumnsType;
  type: string;
};

export const MeasurementTable = (props: Props) => {
  const { measurement = [], name, defaultColumns, type } = props;

  const [columns, setColumns] = useState<TableColumnsType>(defaultColumns);

  const isVisibleColumn = (key: string) => {
    return columns[key]?.visible || false;
  };

  // console.log(measurement);

  const getCells = (item: any) => {
    switch (type) {
      case 'lines': {
        return (
          <>
            {isVisibleColumn('start') && (
              <td>
                ({item.line[0].x.toFixed(1)}, {item.line[0].y.toFixed(1)})
              </td>
            )}
            {isVisibleColumn('end') && (
              <td>
                ({item.line[1].x.toFixed(1)}, {item.line[1].y.toFixed(1)})
              </td>
            )}
            {isVisibleColumn('distance') && <td>{Number(item.distance).toFixed(1)}</td>}
          </>
        );
      }
      case 'brokenLines': {
        return (
          <>
            {isVisibleColumn('start') && (
              <td>
                ({item.brokenLine[0].x.toFixed(1)}, {item.brokenLine[0].y.toFixed(1)})
              </td>
            )}
            {isVisibleColumn('end') && (
              <td>
                ({item.brokenLine[item.brokenLine.length - 1].x.toFixed(1)},{' '}
                {item.brokenLine[item.brokenLine.length - 1].y.toFixed(1)})
              </td>
            )}
            {isVisibleColumn('distance') && <td>{Number(item.distance).toFixed(1)}</td>}
          </>
        );
      }
      case 'polygons': {
        return (
          <>
            {isVisibleColumn('start') && (
              <td>
                ({item.polygon[0].x.toFixed(1)}, {item.polygon[0].y.toFixed(1)})
              </td>
            )}
            {isVisibleColumn('end') && (
              <td>
                ({item.polygon[item.polygon.length - 1].x.toFixed(1)},{' '}
                {item.polygon[item.polygon.length - 1].y.toFixed(1)})
              </td>
            )}
            {isVisibleColumn('perimeter') && <td>{Number(item.perimeter).toFixed(1)}</td>}
            {isVisibleColumn('area') && <td>{Number(item.area).toFixed(1)}</td>}
          </>
        );
      }
      case 'rectangles': {
        return (
          <>
            {isVisibleColumn('start') && (
              <td>
                ({item.rectangle.x.toFixed(1)}, {item.rectangle.y.toFixed(1)})
              </td>
            )}
            {isVisibleColumn('width') && <td>{item.rectangle.width.toFixed(1)}</td>}
            {isVisibleColumn('height') && <td>{item.rectangle.height.toFixed(1)}</td>}
            {isVisibleColumn('perimeter') && <td>{Number(item.perimeter).toFixed(1)}</td>}
            {isVisibleColumn('area') && <td>{Number(item.area).toFixed(1)}</td>}
          </>
        );
      }
      case 'circles': {
        return (
          <>
            {isVisibleColumn('center') && (
              <td>
                ({item.circle.x.toFixed(1)}, {item.circle.y.toFixed(1)})
              </td>
            )}
            {isVisibleColumn('radius') && <td>{item.circle.radius.toFixed(1)}</td>}
            {isVisibleColumn('length') && <td>{Number(item['length']).toFixed(1)}</td>}
            {isVisibleColumn('area') && <td>{Number(item.area).toFixed(1)}</td>}
          </>
        );
      }
      case 'ellipses': {
        return (
          <>
            {isVisibleColumn('center') && (
              <td>
                ({item.ellipse.x.toFixed(1)}, {item.ellipse.y.toFixed(1)})
              </td>
            )}
            {isVisibleColumn('radiusX') && <td>{item.ellipse.radiusX.toFixed(1)}</td>}
            {isVisibleColumn('radiusY') && <td>{item.ellipse.radiusY.toFixed(1)}</td>}
            {isVisibleColumn('length') && <td>{Number(item['length']).toFixed(1)}</td>}
            {isVisibleColumn('area') && <td>{Number(item.area).toFixed(1)}</td>}
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
        <IconDownload width={18} height={18} stroke={1.5} className='table__csv-btn' />
        <span>{name}</span>
        <ColumnSelect columns={columns} setColumns={setColumns} />
      </div>
      <table className='table'>
        <thead>
          <tr>
            {Object.entries(columns)
              .filter(([_, column]) => column.visible)
              .map(([key, column]) => (
                <th key={key}>{column.title}</th>
              ))}
          </tr>
        </thead>
        <tbody>
          {measurement.map((item: any, index: number) => (
            <tr key={index}>
              {getCells(item)}
              {isVisibleColumn('note') && (
                <td className='table__input-note'>
                  <InputNote placeholder='Примечание' value={item.note} onChange={() => {}} />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
