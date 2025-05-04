import { ReactNode } from 'react';

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
            <td>{item.distance} нм</td>
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
            <td>{item.distance} нм</td>
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
            <td>{item.area} нм&sup2;</td>
            <td>{item.perimeter} нм</td>
          </>
        );
      }
      // case 'rectangles': {
      //   return (
      //     <>
      //       <td>
      //         ({item.rectangle[0].x.toFixed(1)}, {item.rectangle[0].y.toFixed(1)})
      //       </td>
      //       <td>
      //         ({item.rectangle[item.rectangle.length - 1].x.toFixed(1)},{' '}
      //         {item.polygon[item.polygon.length - 1].y.toFixed(1)})
      //       </td>
      //       <td>{item.area} нм&sup2;</td>
      //       <td>{item.perimeter} нм</td>
      //     </>
      //   );
      // }
      default:
        return null;
    }
  };

  return (
    <div>
      <div className='table__name'>{name}</div>
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
