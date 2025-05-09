import { Point, Polygon } from 'services/zustand/types';

type Contour = { points: Point[] };
type ContoursData = { contours: Contour[] };
type PolygonsData = Polygon[];

export const convertContoursToPolygons = (data: ContoursData): PolygonsData => {
  return data.contours
    .map(contour => {
      const validPoints = contour.points.filter(
        point => point.x !== undefined && point.y !== undefined && !isNaN(point.x) && !isNaN(point.y),
      );

      return validPoints;
    })
    .filter(polygon => polygon.length >= 3);
};
