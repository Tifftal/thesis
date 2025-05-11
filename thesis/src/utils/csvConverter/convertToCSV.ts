/* eslint-disable no-console */
/* eslint-disable default-case */
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

import { ImageType } from 'services/zustand/types';

import { BrokenLineData, CircleData, EllipseData, LineData, PolygonData, RectangleData } from './types';

interface ImageMeasurements {
  lines?: LineData[];
  brokenLines?: BrokenLineData[];
  polygons?: PolygonData[];
  rectangles?: RectangleData[];
  circles?: CircleData[];
  ellipses?: EllipseData[];
}

const escapeCsvValue = (value: string) => {
  if (value.includes('"') || value.includes(',') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
};

const convertLinesToCSV = (data: LineData[]): string => {
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

const convertBrokenLinesToCSV = (data: BrokenLineData[]): string => {
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

const convertPolygonsToCSV = (data: PolygonData[]): string => {
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

const convertRectanglesToCSV = (data: RectangleData[]): string => {
  const headers = 'Start X,Start Y,Width,Height,Area,Perimeter,Note\n';

  const rows = data
    .map(item => {
      const { x, y, width, height } = item.rectangle;
      return [x, y, width, height, item.area, item.perimeter, escapeCsvValue(item.note)].join(',');
    })
    .join('\n');

  return headers + rows;
};

const convertCirclesToCSV = (data: CircleData[]): string => {
  const headers = 'Center X,Center Y,Radius,Area,Circumference,Note\n';

  const rows = data
    .map(item => {
      const { x, y, radius } = item.circle;
      return [x, y, radius, item.area, item.length, escapeCsvValue(item.note)].join(',');
    })
    .join('\n');

  return headers + rows;
};

const convertEllipsesToCSV = (data: EllipseData[]): string => {
  const headers = 'Center X,Center Y,Radius X,Radius Y,Area,Circumference,Note\n';

  const rows = data
    .map(item => {
      const { x, y, radiusX, radiusY } = item.ellipse;
      return [x, y, radiusX, radiusY, item.area, item.length, escapeCsvValue(item.note)].join(',');
    })
    .join('\n');

  return headers + rows;
};

const downloadCSVFile = (csvData: string, filename: string) => {
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

export const handleDownloadCSVByType = (type: string, measurement: any, selectedImage: ImageType | null) => {
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

export const handleDownloadCSVInZIP = async (
  selectedImage: ImageType | null,
  imageMeasurements: ImageMeasurements,
) => {
  if (!selectedImage || !imageMeasurements) {
    throw new Error('Invalid input data');
  }

  try {
    const zip = new JSZip();
    const baseName = selectedImage.fileName.split('.')[0] || selectedImage.fileName;
    const keys = Object.keys(imageMeasurements) as (keyof ImageMeasurements)[];

    keys.forEach(key => {
      if (!imageMeasurements[key]?.length) return;

      let csvData = '';
      try {
        switch (key) {
          case 'lines':
            csvData = convertLinesToCSV(imageMeasurements[key]!);
            break;
          case 'brokenLines':
            csvData = convertBrokenLinesToCSV(imageMeasurements[key]!);
            break;
          case 'polygons':
            csvData = convertPolygonsToCSV(imageMeasurements[key]!);
            break;
          case 'rectangles':
            csvData = convertRectanglesToCSV(imageMeasurements[key]!);
            break;
          case 'circles':
            csvData = convertCirclesToCSV(imageMeasurements[key]!);
            break;
          case 'ellipses':
            csvData = convertEllipsesToCSV(imageMeasurements[key]!);
            break;
        }

        if (csvData) {
          zip.file(`${baseName}_${key}.csv`, csvData);
        }
      } catch (error) {
        console.error(`Error processing ${key}:`, error);
      }
    });

    if (Object.keys(zip.files).length === 0) {
      throw new Error('No valid data to export');
    }

    const content = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
    });
    saveAs(content, `${baseName}_measurements.zip`);
  } catch (error) {
    console.error('ZIP creation failed:', error);
    throw error;
  }
};
