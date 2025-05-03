/* eslint-disable no-mixed-operators */

import { Point, Rectangle } from 'services/zustand/types';

/**
 * Вычисляет расстояние между двумя точками
 * @param {Object} p1 - Первая точка с координатами x и y
 * @param {number} p1.x - Координата X первой точки
 * @param {number} p1.y - Координата Y первой точки
 * @param {Object} p2 - Вторая точка с координатами x и y
 * @param {number} p2.x - Координата X второй точки
 * @param {number} p2.y - Координата Y второй точки
 * @returns {string|null} Расстояние между точками, отформатированное до 2 знаков после запятой,
 *                       или null если точки невалидны
 *
 */
export const calculateDistance = (
  p1: { x: number; y: number } | null | undefined,
  p2: { x: number; y: number } | null | undefined,
): string | null => {
  if (
    !p1 ||
    !p2 ||
    typeof p1.x !== 'number' ||
    typeof p1.y !== 'number' ||
    typeof p2.x !== 'number' ||
    typeof p2.y !== 'number'
  ) {
    return null;
  }

  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;

  return Math.sqrt(dx * dx + dy * dy).toFixed(2);
};

//TODO: описание

export const calculatePolylineLength = (points: Point[]): number => {
  if (points.length < 2) return 0;

  let totalLength = 0;

  for (let i = 0; i < points.length - 1; i++) {
    const currentPoint = points[i];
    const nextPoint = points[i + 1];

    const dx = nextPoint.x - currentPoint.x;
    const dy = nextPoint.y - currentPoint.y;
    const segmentLength = Math.sqrt(dx * dx + dy * dy);

    totalLength += segmentLength;
  }

  return totalLength;
};

export const calculatePolygonArea = (points: Point[]): number => {
  if (points.length < 3) {
    return 0;
  }

  let area = 0;
  const n = points.length;

  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }

  return Math.abs(area) / 2;
};

export const calculateRectangleLength = (rect: Rectangle): number => {
  return (Math.abs(rect.height) + Math.abs(rect.width)) * 2;
};

export const calculateRectangleArea = (rect: Rectangle): number => {
  return Math.abs(rect.height) * Math.abs(rect.width);
};

export const calculateCircleArea = (radius: number): number => {
  return parseFloat((Math.PI * Math.pow(radius, 2)).toFixed(2));
};

/**
 * Вычисляет площадь эллипса
 * @param radiusX - радиус по горизонтальной оси (большая полуось)
 * @param radiusY - радиус по вертикальной оси (малая полуось)
 * @returns Площадь эллипса
 */
export const calculateEllipseArea = (radiusX: number, radiusY: number): number => {
  return Math.PI * radiusX * radiusY;
};
