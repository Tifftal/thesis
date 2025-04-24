/* eslint-disable no-mixed-operators */
import { Layer, Rect, Group } from 'react-konva';

import { Rectangle } from 'services/zustand/types';

type Props = {
  scale: number;
  imagePosition: { x: number; y: number };
  currentRectangle: Rectangle | null;
  rectangles: Rectangle[];
  onDragEnd: (index: number, rect: Rectangle) => void;
  onTransformEnd: (index: number, rect: Rectangle) => void;
};

export const RectangleLayer = ({
  scale,
  imagePosition,
  currentRectangle,
  rectangles,
  onDragEnd,
  onTransformEnd,
}: Props) => {
  return (
    <Layer>
      {/* Рендер сохраненных прямоугольников */}
      {rectangles.map((rect, index) => (
        <Group
          key={`rect-${index}`}
          draggable
          onDragEnd={e => {
            const node = e.target;
            onDragEnd(index, {
              x: node.x(),
              y: node.y(),
              width: node.width(),
              height: node.height(),
            });
          }}
          onTransformEnd={e => {
            const node = e.target;
            onTransformEnd(index, {
              x: node.x(),
              y: node.y(),
              width: node.width() * node.scaleX(),
              height: node.height() * node.scaleY(),
            });
            node.scaleX(1);
            node.scaleY(1);
          }}>
          <Rect
            x={rect.x * scale + imagePosition.x}
            y={rect.y * scale + imagePosition.y}
            width={rect.width * scale}
            height={rect.height * scale}
            stroke='blue'
            strokeWidth={2}
            fill='rgba(0, 0, 255, 0.2)'
            draggable
          />
        </Group>
      ))}

      {/* Рендер текущего прямоугольника */}
      {currentRectangle && (
        <Rect
          x={currentRectangle.x * scale + imagePosition.x}
          y={currentRectangle.y * scale + imagePosition.y}
          width={currentRectangle.width * scale}
          height={currentRectangle.height * scale}
          stroke='red'
          strokeWidth={2}
          fill='rgba(255, 0, 0, 0.2)'
        />
      )}
    </Layer>
  );
};
