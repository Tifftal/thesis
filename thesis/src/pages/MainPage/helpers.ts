/* eslint-disable no-mixed-operators */
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
 * @example
 * // Возвращает "5.00"
 * const distance = calculateDistance({x: 0, y: 0}, {x: 3, y: 4});
 *
 * @example
 * // Возвращает null
 * const distance = calculateDistance(null, {x: 3, y: 4});
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
