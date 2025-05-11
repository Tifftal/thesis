import { Point } from 'services/zustand/types';

export type LineData = {
  line: Point[];
  distance: string;
  note: string;
};

export type BrokenLineData = {
  brokenLine: Point[];
  distance: string;
  note: string;
};

export type PolygonData = {
  polygon: Point[];
  perimeter: string;
  area: string;
  note: string;
};

export type RectangleData = {
  rectangle: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  area: number;
  perimeter: number;
  note: string;
};

export type CircleData = {
  circle: {
    x: number;
    y: number;
    radius: number;
  };
  area: string;
  length: string;
  note: string;
};

export type EllipseData = {
  ellipse: {
    x: number;
    y: number;
    radiusX: number;
    radiusY: number;
  };
  area: string;
  length: string;
  note: string;
};
