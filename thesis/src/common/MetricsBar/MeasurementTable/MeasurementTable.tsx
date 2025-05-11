/* eslint-disable complexity */
import { ReactNode, useState } from 'react';

import { IconDownload } from '@tabler/icons-react';
import {
  convertBrokenLinesToCSV,
  convertCirclesToCSV,
  convertEllipsesToCSV,
  convertLinesToCSV,
  convertPolygonsToCSV,
  convertRectanglesToCSV,
  downloadCSVFile,
} from 'utils/csvConverter/convertToCSV';

import useStore from 'services/zustand/store';
import { ZustandStoreStateType } from 'services/zustand/types';

import { InputNote } from 'ui-kit/inputs/InputNote';

import { ColumnSelect } from '../ColumnSelect/ColumnSelect';

import { TableColumnsType } from './types';

import './measurement-table.css';
import useToast from 'utils/hooks/useToast';

type Props = {
  measurement: any;
  name: string | ReactNode;
  defaultColumns: TableColumnsType;
  type: string;
};

export const MeasurementTable = (props: Props) => {
  const { measurement = [], name, defaultColumns, type } = props;

  const { setSavedMeasurements, savedMeasurements, selectedImage } = useStore(
    (state: ZustandStoreStateType) => state,
  );

  const { onMessage } = useToast();

  const [columns, setColumns] = useState<TableColumnsType>(defaultColumns);

  const isVisibleColumn = (key: string) => {
    return columns[key]?.visible || false;
  };

  const handleChangeNote = (value: string, index: number) => {
    if (!savedMeasurements || !selectedImage?.id) return;

    const currentImageMeasurements = savedMeasurements[selectedImage.id] || {};

    const currentItems = currentImageMeasurements[type] || [];

    const updatedItem = { ...currentItems[index], note: value };

    const updatedItems = [...currentItems.slice(0, index), updatedItem, ...currentItems.slice(index + 1)];

    const newSavedMeasurements = {
      ...savedMeasurements,
      [selectedImage.id]: {
        ...currentImageMeasurements,
        [type]: updatedItems,
      },
    };

    setSavedMeasurements(newSavedMeasurements);
  };

  const handleDownloadCSV = () => {
    onMessage('Скачивание начнется в течении нескольких секунд...', 'success', 'Загрузка файла');
    switch (type) {
      case 'lines': {
        setTimeout(() => {
          const csvData = convertLinesToCSV(measurement);
          downloadCSVFile(csvData, `${selectedImage?.fileName.split('.')[0]}_lines`);
        }, 500);
        break;
      }
      case 'brokenLines': {
        setTimeout(() => {
          const csvData = convertBrokenLinesToCSV(measurement);
          downloadCSVFile(csvData, `${selectedImage?.fileName.split('.')[0]}_broken-lines`);
        }, 500);
        break;
      }
      case 'polygons': {
        setTimeout(() => {
          const csvData = convertPolygonsToCSV(measurement);
          downloadCSVFile(csvData, `${selectedImage?.fileName.split('.')[0]}_polygons`);
        }, 500);
        break;
      }
      case 'rectangles': {
        setTimeout(() => {
          const csvData = convertRectanglesToCSV(measurement);
          downloadCSVFile(csvData, `${selectedImage?.fileName.split('.')[0]}_rectangles`);
        }, 500);
        break;
      }
      case 'circles': {
        setTimeout(() => {
          const csvData = convertCirclesToCSV(measurement);
          downloadCSVFile(csvData, `${selectedImage?.fileName.split('.')[0]}_circles`);
        }, 500);
        break;
      }
      case 'ellipses': {
        setTimeout(() => {
          const csvData = convertEllipsesToCSV(measurement);
          downloadCSVFile(csvData, `${selectedImage?.fileName.split('.')[0]}_ellipses`);
        }, 500);
        break;
      }
      default:
        break;
    }
  };

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
        <IconDownload
          width={18}
          height={18}
          stroke={1.5}
          className='table__csv-btn'
          onClick={handleDownloadCSV}
        />
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
                  <InputNote
                    value={item.note}
                    onChange={value => handleChangeNote(value, index)}
                    placeholder='Примечание'
                  />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
