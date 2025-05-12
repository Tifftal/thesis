import {
  IconAngle,
  IconCircle,
  IconLine,
  IconPolygon,
  IconRectangle,
  IconTimeline as IconBrokenLine,
  IconOvalVertical,
} from '@tabler/icons-react';

export const NAVBAR_TOOL_ITEMS = [
  {
    key: 'line',
    IconComponent: IconLine,
    tooltip: 'Прямая',
  },
  {
    key: 'broken-line',
    IconComponent: IconBrokenLine,
    tooltip: 'Ломаная',
  },
  {
    key: 'polygon',
    IconComponent: IconPolygon,
    tooltip: 'Многоугольник',
  },
  {
    key: 'rectangle',
    IconComponent: IconRectangle,
    tooltip: 'Прямоугольник',
  },
  {
    key: 'circle',
    IconComponent: IconCircle,
    tooltip: 'Окружность',
  },
  {
    key: 'ellipse',
    IconComponent: IconOvalVertical,
    tooltip: 'Эллипс',
  },
  {
    key: 'angle',
    IconComponent: IconAngle,
    tooltip: 'Абсолютный угол',
  },
];
