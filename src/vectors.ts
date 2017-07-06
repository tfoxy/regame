export interface Vector {
  x: number;
  y: number;
}

export const NULL_VECTOR = { x: 0, y: 0 };
export const NAN_VECTOR = { x: NaN, y: NaN };

export function angleBetweenTwoVectors(source: Vector, destination: Vector) {
  const dx = destination.x - source.x;
  const dy = destination.y - source.y;
  const angle = Math.atan2(dy, dx);
  return angle;
}
