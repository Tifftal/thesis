/* eslint-disable no-mixed-operators */
import { useEffect, useState } from 'react';

import { Layer, Rect, Group } from 'react-konva';

import useStore from 'services/zustand/store';
import { Rectangle, ZustandStoreStateType } from 'services/zustand/types';

type Props = {
  scale: number;
  imagePosition: { x: number; y: number };
  handleRightClick: (e: any, type: string, currentObject?: any) => void;
  currentRectangle: Rectangle | null;
  // onDragEnd: (index: number, rect: Rectangle) => void;
  // onTransformEnd: (index: number, rect: Rectangle) => void;
};

export const RectangleLayer = ({
  scale,
  imagePosition,
  currentRectangle,
  handleRightClick,
  // onDragEnd,
  // onTransformEnd,
}: Props) => {
  const { visibleLayers, selectedLayer } = useStore((state: ZustandStoreStateType) => state);

  const [disabledRectangles, setDisabledRectangles] = useState<Rectangle[]>([]);

  useEffect(() => {
    const disabledLayers = visibleLayers.filter(layer => layer.id !== selectedLayer?.id);
    const allRectangles = disabledLayers.flatMap(layer => layer.measurements?.rectangles || []);
    setDisabledRectangles(allRectangles);
  }, [visibleLayers, selectedLayer]);

  return (
    <Layer>
      {disabledRectangles.map((rect, index) => (
        <Group key={`rect-${index}`}>
          <Rect
            x={rect.x * scale + imagePosition.x}
            y={rect.y * scale + imagePosition.y}
            width={rect.width * scale}
            height={rect.height * scale}
            stroke='rgba(255, 0, 0, 0.5)'
            strokeWidth={2}
            fill='rgba(255, 0, 0, 0.3)'
            // draggable
          />
        </Group>
      ))}

      {(selectedLayer?.measurements?.rectangles || []).map((rect: Rectangle, index: number) => (
        <Group
          key={`rect-${index}`}
          // draggable
          // onDragEnd={e => {
          //   const node = e.target;
          //   onDragEnd(index, {
          //     x: node.x(),
          //     y: node.y(),
          //     width: node.width(),
          //     height: node.height(),
          //   });
          // }}
          // onTransformEnd={e => {
          //   const node = e.target;
          //   onTransformEnd(index, {
          //     x: node.x(),
          //     y: node.y(),
          //     width: node.width() * node.scaleX(),
          //     height: node.height() * node.scaleY(),
          //   });
          //   node.scaleX(1);
          //   node.scaleY(1);
          // }}
        >
          <Rect
            x={rect.x * scale + imagePosition.x}
            y={rect.y * scale + imagePosition.y}
            width={rect.width * scale}
            height={rect.height * scale}
            stroke='rgb(255, 0, 0)'
            strokeWidth={2}
            fill='rgba(255, 0, 0, 0.6)'
            onContextMenu={e => handleRightClick(e, 'RECTANGLE', rect)}
            // draggable
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
          stroke='rgb(0, 255, 0)'
          strokeWidth={2}
          fill='rgba(0, 255, 0, 0.4)'
        />
      )}
    </Layer>
  );
};
