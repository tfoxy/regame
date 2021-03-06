import Entity from './entities/Entity';
import GameMap from './GameMap';
import {
  Vector,
  angleBetweenTwoVectors,
} from './vectors';

const PI2 = 2 * Math.PI;
const ANGLE_DELTA = 0.00001;
const VISION_CONE_ANGLE = Math.PI * 0.35;

interface Intersection {
  x: number;
  y: number;
  param?: number;
  angle?: number;
}

// Find intersection of RAY & SEGMENT
function getIntersection(
  ray: { a: Vector, b: Vector },
  segment: { a: Vector, b: Vector },
): Intersection {
  // RAY in parametric: Point + Delta*T1
  const rPx = ray.a.x;
  const rPy = ray.a.y;
  const rDx = ray.b.x - ray.a.x;
  const rDy = ray.b.y - ray.a.y;

  // SEGMENT in parametric: Point + Delta*T2
  const sPx = segment.a.x;
  const sPy = segment.a.y;
  const sDx = segment.b.x - segment.a.x;
  const sDy = segment.b.y - segment.a.y;

  // Are they parallel? If so, no intersect
  const rMag = Math.sqrt(rDx * rDx + rDy * rDy);
  const sMag = Math.sqrt(sDx * sDx + sDy * sDy);
  if (rDx / rMag === sDx / sMag && rDy / rMag === sDy / sMag) {
    // Unit vectors are the same.
    return null;
  }

  // SOLVE FOR T1 & T2
  // r_px+r_dx*T1 = s_px+s_dx*T2 && r_py+r_dy*T1 = s_py+s_dy*T2
  // ==> T1 = (s_px+s_dx*T2-r_px)/r_dx = (s_py+s_dy*T2-r_py)/r_dy
  // ==> s_px*r_dy + s_dx*T2*r_dy - r_px*r_dy = s_py*r_dx + s_dy*T2*r_dx - r_py*r_dx
  // ==> T2 = (r_dx*(s_py-r_py) + r_dy*(r_px-s_px))/(s_dx*r_dy - s_dy*r_dx)
  const T2 = (rDx * (sPy - rPy) + rDy * (rPx - sPx)) / (sDx * rDy - sDy * rDx);
  const T1 = (sPx + sDx * T2 - rPx) / rDx;

  // Must be within parametic whatevers for RAY/SEGMENT
  if (T1 < 0) return null;
  if (T2 < 0 || T2 > 1) return null;

  // Return the POINT OF INTERSECTION
  return {
    x: rPx + rDx * T1,
    y: rPy + rDy * T1,
    param: T1,
  };
}

export default class Fov {
  entity: Entity;
  map: GameMap;
  intersects: Vector[];

  constructor(entity: Entity) {
    this.entity = entity;
  }

  setMap(map) {
    this.map = map;
  }

  update() {
    if (this.entity.isOutOfGame()) {
      this.intersects = [];
      return;
    }
    const points = this.map.wallPoints;
    const minAngle = this.entity.angle - VISION_CONE_ANGLE;
    const maxAngle = this.entity.angle + VISION_CONE_ANGLE;
    const oppositeAngle = this.entity.angle + (this.entity.angle < 0 ? Math.PI : -Math.PI);

    const angles = [minAngle, maxAngle];
    points.forEach((point, i) => {
      let angle = angleBetweenTwoVectors(this.entity.position, point);
      if (oppositeAngle > 0 && angle > oppositeAngle) angle -= 2 * Math.PI;
      else if (oppositeAngle < 0 && angle < oppositeAngle) angle += 2 * Math.PI;
      if (angle <= maxAngle && angle >= minAngle) {
        angles.push(angle - ANGLE_DELTA, angle, angle + ANGLE_DELTA);
      }
    });

    const intersects: Intersection[] = [{
      x: this.entity.position.x,
      y: this.entity.position.y,
      angle: minAngle - ANGLE_DELTA,
    }, {
      x: this.entity.position.x,
      y: this.entity.position.y,
      angle: maxAngle + ANGLE_DELTA,
    }];
    angles.forEach((angle) => {
      const dx = Math.cos(angle);
      const dy = Math.sin(angle);

      const source = this.entity.position;
      const ray = {
        a: { x: source.x, y: source.y },
        b: { x: source.x + dx, y: source.y + dy },
      };

      let closestIntersect: Intersection = null;
      this.map.wallSegments.forEach((segment) => {
        const intersect = getIntersection(ray, segment);
        if (intersect && (!closestIntersect || intersect.param < closestIntersect.param)) {
          closestIntersect = intersect;
        }
      });

      if (closestIntersect) {
        closestIntersect.angle = angle;
        intersects.push(closestIntersect);
      }
    });

    // Sort intersects by angle
    intersects.sort((a,b) => {
      return a.angle - b.angle;
    });

    this.intersects = intersects;
  }
}
