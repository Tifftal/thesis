import _ from 'lodash';

import {
  BrokenLine,
  Circle,
  Ellipse,
  ImageType,
  Line,
  Point,
  Polygon,
  Rectangle,
  SavedBrokenLine,
  SavedCircle,
  SavedEllipse,
  SavedLine,
  SavedPolygon,
  SavedRectangle,
} from 'services/zustand/types';

import {
  getScaledCoord,
  calculateDistance,
  calculatePolylineLength,
  calculatePolygonArea,
  calculateRectangleLength,
  calculateRectangleArea,
  getScaledNumber,
  calculateCircleArea,
  calculateCircumference,
  calculateEllipseArea,
  calculateEllipseCircumference,
} from 'components/MainPage/helpers';

export const getSavedLine = (
  line: Line,
  scaleFactor: number | null,
  onMessage: (message: string, type: string, label?: string) => void,
  savedMeasurements: Record<string, any> | null,
  selectedImage: ImageType,
  closeContextMenu?: () => void,
) => {
  const scaledLine: Line = [getScaledCoord(line[0], scaleFactor), getScaledCoord(line[1], scaleFactor)];

  const isLineExists = savedMeasurements?.[selectedImage.id]?.lines?.some((existingLine: SavedLine) => {
    return (
      _.isEqual(existingLine.line, scaledLine) || _.isEqual(existingLine.line, [...scaledLine].reverse())
    );
  });

  if (isLineExists) {
    onMessage('Линия с такими координатами уже существует', 'error', 'Дубликат линии');
    closeContextMenu && closeContextMenu();
    return null;
  }

  const scaledDistance = calculateDistance(line[0], line[1], scaleFactor);

  const newLine: SavedLine = {
    line: scaledLine,
    distance: scaledDistance,
    note: '',
  };

  return newLine;
};

export const getSavedBrokenLine = (
  brokenLine: BrokenLine,
  scaleFactor: number | null,
  onMessage: (message: string, type: string, label?: string) => void,
  savedMeasurements: Record<string, any> | null,
  selectedImage: ImageType,
  closeContextMenu?: () => void,
) => {
  const scaledBrokenLine: BrokenLine = brokenLine.map((point: Point) => getScaledCoord(point, scaleFactor));

  const isBrokenLineExists = savedMeasurements?.[selectedImage.id]?.brokenLines?.some(
    (existingLine: SavedBrokenLine) => {
      return (
        _.isEqual(existingLine.brokenLine, scaledBrokenLine) ||
        _.isEqual(existingLine.brokenLine, [...scaledBrokenLine].reverse())
      );
    },
  );

  if (isBrokenLineExists) {
    onMessage('Ломаная с такими координатами уже существует', 'error', 'Дубликат ломаной');
    closeContextMenu && closeContextMenu();
    return null;
  }

  const scaledDistance = calculatePolylineLength(brokenLine, scaleFactor);

  const newBrokenLine: SavedBrokenLine = {
    brokenLine: scaledBrokenLine,
    distance: scaledDistance,
    note: '',
  };

  return newBrokenLine;
};

export const getSavedPolygon = (
  polygon: Polygon,
  scaleFactor: number | null,
  onMessage: (message: string, type: string, label?: string) => void,
  savedMeasurements: Record<string, any> | null,
  selectedImage: ImageType,
  closeContextMenu?: () => void,
) => {
  const scaledPolygon: Polygon = polygon.map((point: Point) => getScaledCoord(point, scaleFactor));

  const isPolygonExists = savedMeasurements?.[selectedImage.id]?.polygons?.some((existItem: SavedPolygon) => {
    return (
      _.isEqual(existItem.polygon, scaledPolygon) ||
      _.isEqual(existItem.polygon, [...scaledPolygon].reverse())
    );
  });

  if (isPolygonExists) {
    onMessage('Многоугольник с такими координатами уже существует', 'error', 'Дубликат многоугольника');
    closeContextMenu && closeContextMenu();
    return null;
  }

  const scaledDistance = calculatePolylineLength(polygon, scaleFactor);

  const newPolygon: SavedPolygon = {
    polygon: scaledPolygon,
    perimeter: scaledDistance,
    area: calculatePolygonArea(polygon, scaleFactor),
    note: '',
  };

  return newPolygon;
};

export const getSavedRectangle = (
  rectangle: Rectangle,
  scaleFactor: number | null,
  onMessage: (message: string, type: string, label?: string) => void,
  savedMeasurements: Record<string, any> | null,
  selectedImage: ImageType,
  closeContextMenu?: () => void,
) => {
  const scaledRectangle: Rectangle = {
    x: getScaledNumber(rectangle.x, scaleFactor),
    y: getScaledNumber(rectangle.y, scaleFactor),
    width: getScaledNumber(rectangle.width, scaleFactor),
    height: getScaledNumber(rectangle.height, scaleFactor),
  };

  const isRectangleExists = savedMeasurements?.[selectedImage.id]?.rectangles?.some(
    (existItem: SavedRectangle) => {
      return _.isEqual(existItem.rectangle, scaledRectangle);
    },
  );

  if (isRectangleExists) {
    onMessage('Прямоугольник с такими координатами уже существует', 'error', 'Дубликат прямоугольника');
    closeContextMenu && closeContextMenu();
    return null;
  }

  const newRectangle: SavedRectangle = {
    rectangle: scaledRectangle,
    area: calculateRectangleLength(rectangle, scaleFactor),
    perimeter: calculateRectangleArea(rectangle, scaleFactor),
    note: '',
  };

  return newRectangle;
};

export const getSavedCircle = (
  circle: Circle,
  scaleFactor: number | null,
  onMessage: (message: string, type: string, label?: string) => void,
  savedMeasurements: Record<string, any> | null,
  selectedImage: ImageType,
  closeContextMenu?: () => void,
) => {
  const scaledCircle: Circle = {
    x: getScaledNumber(circle.x, scaleFactor),
    y: getScaledNumber(circle.y, scaleFactor),
    radius: getScaledNumber(circle.radius, scaleFactor),
  };

  const isCircleExists = savedMeasurements?.[selectedImage.id]?.circles?.some((existItem: SavedCircle) => {
    return _.isEqual(existItem.circle, scaledCircle);
  });

  if (isCircleExists) {
    onMessage('Окружность с такими координатами уже существует', 'error', 'Дубликат окружности');
    closeContextMenu && closeContextMenu();
    return null;
  }

  const newCircle: SavedCircle = {
    circle: scaledCircle,
    area: calculateCircleArea(circle.radius, scaleFactor),
    length: calculateCircumference(circle.radius, scaleFactor),
    note: '',
  };

  return newCircle;
};

export const getSavedEllipse = (
  ellipse: Ellipse,
  scaleFactor: number | null,
  onMessage: (message: string, type: string, label?: string) => void,
  savedMeasurements: Record<string, any> | null,
  selectedImage: ImageType,
  closeContextMenu?: () => void,
) => {
  const scaledEllipse: Ellipse = {
    x: getScaledNumber(ellipse.x, scaleFactor),
    y: getScaledNumber(ellipse.y, scaleFactor),
    radiusX: getScaledNumber(ellipse.radiusX, scaleFactor),
    radiusY: getScaledNumber(ellipse.radiusY, scaleFactor),
  };

  const isEllipseExists = savedMeasurements?.[selectedImage.id]?.ellipses?.some((existItem: SavedEllipse) => {
    return _.isEqual(existItem.ellipse, scaledEllipse);
  });

  if (isEllipseExists) {
    onMessage('Эллипс с такими координатами уже существует', 'error', 'Дубликат эллипса');
    closeContextMenu && closeContextMenu();
    return null;
  }

  const newEllipse: SavedEllipse = {
    ellipse: scaledEllipse,
    area: calculateEllipseArea(ellipse.radiusX, ellipse.radiusY, scaleFactor),
    length: calculateEllipseCircumference(ellipse.radiusX, ellipse.radiusY, scaleFactor),
    note: '',
  };

  return newEllipse;
};

export const mergeMeasurements = (
  current: Record<string, any>,
  scaled: Record<string, any>,
): Record<string, any> => {
  const result: Record<string, any> = {};

  const allKeys = new Set([...Object.keys(current), ...Object.keys(scaled)]);

  allKeys.forEach(key => {
    if (current[key] || scaled[key]) {
      result[key] = [...(current[key] || []), ...(scaled[key] || [])];
    }
  });

  return result;
};
