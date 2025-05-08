/* eslint-disable no-mixed-operators */

import { Point, Rectangle } from 'services/zustand/types';

export const getScaledNumber = (number: number, scaleFactor: number | null): number => {
  if (!scaleFactor) {
    return number;
  }
  return number * scaleFactor;
};

export const getScaledCoord = (coord: Point, scaleFactor: number | null): Point => {
  if (!scaleFactor) {
    return coord;
  }

  return { x: coord.x * scaleFactor, y: coord.y * scaleFactor };
};

export const getScaledParameter = (
  param: number,
  scaleFactor: number | null,
  imageUnits: string | undefined,
  isFixed?: boolean | number,
): string => {
  if (!scaleFactor) {
    return `${param}`;
  }

  const paramUnits = param * scaleFactor;

  const formattedValue = paramUnits;

  if (isFixed) {
    const fixedValue = formattedValue.toFixed(typeof isFixed === 'number' ? isFixed : 2);
    return `${fixedValue} ${imageUnits}`;
  }

  return `${formattedValue} ${imageUnits}`;
};

/**
 * Вычисляет расстояние между двумя точками
 * @param {Object} p1 - Первая точка с координатами x и y
 * @param {number} p1.x - Координата X первой точки
 * @param {number} p1.y - Координата Y первой точки
 * @param {Object} p2 - Вторая точка с координатами x и y
 * @param {number} p2.x - Координата X второй точки
 * @param {number} p2.y - Координата Y второй точки
 * @param {number} imageWidth - Ширина изображения
 * @param {number} imageUnits - Единицы измерения
 * @param {Object} nativeSize - Разммеры изображения в пикселях
 * @returns {string|null} Расстояние между точками, отформатированное до 2 знаков после запятой,
 *                       или null если точки невалидны
 *
 */
export const calculateDistance = (
  p1: Point | null | undefined,
  p2: Point | null | undefined,
  scaleFactor: number | null,
  imageUnits?: string,
): string => {
  if (
    !p1 ||
    !p2 ||
    typeof p1.x !== 'number' ||
    typeof p1.y !== 'number' ||
    typeof p2.x !== 'number' ||
    typeof p2.y !== 'number'
  ) {
    return '';
  }

  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const distancePixels = Math.sqrt(dx * dx + dy * dy);

  if (!scaleFactor) {
    return `${distancePixels.toFixed(2)} px`;
  }

  const distanceUnits = distancePixels * scaleFactor;

  if (!imageUnits) return `${distanceUnits}`;

  const formattedValue = distanceUnits.toFixed(2);
  return `${formattedValue} ${imageUnits}`;
};

//TODO: описание

export const calculatePolylineLength = (
  points: Point[],
  scaleFactor: number | null,
  imageUnits?: string,
): string => {
  if (points.length < 2) return '0';

  let totalLength = 0;

  for (let i = 0; i < points.length - 1; i++) {
    const currentPoint = points[i];
    const nextPoint = points[i + 1];

    const dx = nextPoint.x - currentPoint.x;
    const dy = nextPoint.y - currentPoint.y;
    const segmentLength = Math.sqrt(dx * dx + dy * dy);

    totalLength += segmentLength;
  }

  if (!scaleFactor) {
    return `${totalLength.toFixed(2)} px`;
  }

  const totalUnits = totalLength * scaleFactor;

  if (!imageUnits) return `${totalUnits}`;

  const formattedValue = totalUnits.toFixed(2);
  return `${formattedValue} ${imageUnits}`;
};

export const calculatePolygonArea = (
  points: Point[],
  scaleFactor: number | null,
  imageUnits?: string,
): string => {
  if (points.length < 3) {
    return '0';
  }

  let area = 0;
  const n = points.length;

  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }

  const polygonArea = Math.abs(area) / 2;

  if (!scaleFactor) {
    return `${polygonArea.toFixed(2)} px`;
  }

  const areaUnits = polygonArea * scaleFactor;

  if (!imageUnits) return `${areaUnits}`;

  const formattedValue = areaUnits.toFixed(2);
  return `${formattedValue} ${imageUnits}`;
};

export const calculateRectangleLength = (
  rect: Rectangle,
  scaleFactor: number | null,
  imageUnits?: string,
): string => {
  const length = (Math.abs(rect.height) + Math.abs(rect.width)) * 2;

  if (!scaleFactor) {
    return `${length.toFixed(2)} px`;
  }

  const lengthUnits = length * scaleFactor;

  if (!imageUnits) return `${lengthUnits}`;

  const formattedValue = lengthUnits.toFixed(2);
  return `${formattedValue} ${imageUnits}`;
};

export const calculateRectangleArea = (
  rect: Rectangle,
  scaleFactor: number | null,
  imageUnits?: string,
): string => {
  const area = Math.abs(rect.height) * Math.abs(rect.width);

  if (!scaleFactor) {
    return `${area.toFixed(2)} px`;
  }

  const areaUnits = area * scaleFactor;

  if (!imageUnits) return `${areaUnits}`;

  const formattedValue = areaUnits.toFixed(2);
  return `${formattedValue} ${imageUnits}`;
};

export const calculateCircumference = (
  radius: number,
  scaleFactor: number | null,
  imageUnits?: string,
): string => {
  const circumference = 2 * Math.PI * radius;

  if (!scaleFactor) {
    return `${circumference.toFixed(2)} px`;
  }

  const circumferenceUnits = circumference * scaleFactor;

  if (!imageUnits) {
    return `${circumferenceUnits}`;
  }

  return `${circumferenceUnits.toFixed(2)} ${imageUnits}`;
};

export const calculateCircleArea = (
  radius: number,
  scaleFactor: number | null,
  imageUnits?: string,
): string => {
  const area = Math.PI * Math.pow(radius, 2);

  if (!scaleFactor) {
    return `${area.toFixed(2)} px`;
  }

  const areaUnits = area * scaleFactor;

  if (!imageUnits) return `${areaUnits}`;

  const formattedValue = areaUnits.toFixed(2);
  return `${formattedValue} ${imageUnits}`;
};

/**
 * Вычисляет приблизительную длину (периметр) эллипса
 * @param radiusX - радиус по горизонтальной оси (большая полуось)
 * @param radiusY - радиус по вертикальной оси (малая полуось)
 * @param scaleFactor - коэффициент масштабирования (пиксели в единицы измерения)
 * @param imageUnits - единицы измерения (опционально)
 * @returns Длина эллипса с указанием единиц измерения
 */
export const calculateEllipseCircumference = (
  radiusX: number,
  radiusY: number,
  scaleFactor: number | null,
  imageUnits?: string,
): string => {
  const h = Math.pow(radiusX - radiusY, 2) / Math.pow(radiusX + radiusY, 2);
  const circumference = Math.PI * (radiusX + radiusY) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)));

  if (!scaleFactor) {
    return `${circumference.toFixed(2)} px`;
  }

  const circumferenceUnits = circumference * scaleFactor;

  if (!imageUnits) {
    return `${circumferenceUnits}`;
  }

  return `${circumferenceUnits.toFixed(2)} ${imageUnits}`;
};

/**
 * Вычисляет площадь эллипса
 * @param radiusX - радиус по горизонтальной оси (большая полуось)
 * @param radiusY - радиус по вертикальной оси (малая полуось)
 * @returns Площадь эллипса
 */
export const calculateEllipseArea = (
  radiusX: number,
  radiusY: number,
  scaleFactor: number | null,
  imageUnits?: string,
): string => {
  const area = Math.PI * radiusX * radiusY;

  if (!scaleFactor) {
    return `${area.toFixed(2)} px`;
  }

  const areaUnits = area * scaleFactor;

  if (!imageUnits) return `${areaUnits}`;

  const formattedValue = areaUnits.toFixed(2);
  return `${formattedValue} ${imageUnits}`;
};
