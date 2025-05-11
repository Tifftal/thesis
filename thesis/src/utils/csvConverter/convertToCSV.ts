import { BrokenLineData, CircleData, EllipseData, LineData, PolygonData, RectangleData } from './types';

const escapeCsvValue = (value: string) => {
  if (value.includes('"') || value.includes(',') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
};

export const convertLinesToCSV = (data: LineData[]): string => {
  const headers = 'Start X,Start Y,End X,End Y,Distance,Note\n';

  const rows = data
    .map(item => {
      const start = item.line[0];
      const end = item.line[1];
      return [start.x, start.y, end.x, end.y, item.distance, escapeCsvValue(item.note)].join(',');
    })
    .join('\n');

  return headers + rows;
};

export const convertBrokenLinesToCSV = (data: BrokenLineData[]): string => {
  const maxPoints = Math.max(...data.map(item => item.brokenLine.length));

  const pointHeaders = Array.from({ length: maxPoints }, (_, i) => [
    `Point ${i + 1} X`,
    `Point ${i + 1} Y`,
  ]).flat();

  const headers = [...pointHeaders, 'Total Distance', 'Note'].join(',') + '\n';

  const rows = data
    .map(item => {
      const points: any[] = item.brokenLine.map(point => [point.x, point.y]).flat();

      while (points.length < maxPoints * 2) {
        points.push('', '');
      }

      const row = [...points, item.distance, escapeCsvValue(item.note)];
      return row.join(',');
    })
    .join('\n');

  return headers + rows;
};

export const convertPolygonsToCSV = (data: PolygonData[]): string => {
  const maxPoints = Math.max(...data.map(item => item.polygon.length));

  const pointHeaders = Array.from({ length: maxPoints }, (_, i) => [
    `Vertex ${i + 1} X`,
    `Vertex ${i + 1} Y`,
  ]).flat();

  const headers = [...pointHeaders, 'Perimeter', 'Area', 'Note'].join(',') + '\n';

  const rows = data
    .map(item => {
      const vertices: any[] = item.polygon.map(vertex => [vertex.x, vertex.y]).flat();

      while (vertices.length < maxPoints * 2) {
        vertices.push('', '');
      }

      const row = [...vertices, item.perimeter, item.area, escapeCsvValue(item.note)];
      return row.join(',');
    })
    .join('\n');

  return headers + rows;
};

export const convertRectanglesToCSV = (data: RectangleData[]): string => {
  const headers = 'Start X,Start Y,Width,Height,Area,Perimeter,Note\n';

  const rows = data
    .map(item => {
      const { x, y, width, height } = item.rectangle;
      return [x, y, width, height, item.area, item.perimeter, escapeCsvValue(item.note)].join(',');
    })
    .join('\n');

  return headers + rows;
};

export const convertCirclesToCSV = (data: CircleData[]): string => {
  const headers = 'Center X,Center Y,Radius,Area,Circumference,Note\n';

  const rows = data
    .map(item => {
      const { x, y, radius } = item.circle;
      return [x, y, radius, item.area, item.length, escapeCsvValue(item.note)].join(',');
    })
    .join('\n');

  return headers + rows;
};

export const convertEllipsesToCSV = (data: EllipseData[]): string => {
  const headers = 'Center X,Center Y,Radius X,Radius Y,Area,Circumference,Note\n';

  const rows = data
    .map(item => {
      const { x, y, radiusX, radiusY } = item.ellipse;
      return [x, y, radiusX, radiusY, item.area, item.length, escapeCsvValue(item.note)].join(',');
    })
    .join('\n');

  return headers + rows;
};

export const downloadCSVFile = (csvData: string, filename: string) => {
  const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });

  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
