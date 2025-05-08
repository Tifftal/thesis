import { Point, Polygon } from 'services/zustand/types';

type Contour = { points: Point[] };
type ContoursData = { contours: Contour[] };
type PolygonsData = Polygon[];

export const convertContoursToPolygons = (data: ContoursData): PolygonsData => {
  return data.contours.map(contour => contour.points);
};
