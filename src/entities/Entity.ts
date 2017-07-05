import { Circle as SatCircle, Polygon as SatPolygon } from 'sat';
import {
  Vector,
} from '../vectors';

export default abstract class Entity {
  position: Vector;
  angle: number;
  size: Vector;
  speed: Vector;
  maxSpeedModule: number;
  focusPoint: Vector;
  canvas: HTMLCanvasElement;
  sat: SatCircle | SatPolygon;

  constructor() {
    this.position = { x: NaN, y: NaN };
    this.angle = 0;
    this.size = { x: 0, y: 0 };
    this.speed = { x: 0, y: 0 };
    this.maxSpeedModule = 0;
    this.focusPoint = { x: NaN, y: NaN };
  }

  setPosition(x, y) {
    this.position.x = x;
    this.position.y = y;
  }

  setAngle(angle: number) {
    // noop
  }

  setMovementDirection(x, y) {
    this.speed.x = x * this.maxSpeedModule;
    this.speed.y = y * this.maxSpeedModule;
  }

  setFocusPoint(x, y) {
    // noop
  }
}
