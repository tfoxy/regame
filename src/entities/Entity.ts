import { Circle as SatCircle, Polygon as SatPolygon } from 'sat';
import {
  Vector,
  NULL_VECTOR,
} from '../vectors';

export default abstract class Entity {
  position: Vector;
  angle: number;
  size: Vector;
  speed: Vector;
  maxSpeedModule: number;
  canvas: HTMLCanvasElement;
  sat: SatCircle | SatPolygon;

  constructor() {
    this.position = { x: NaN, y: NaN };
    this.angle = 0;
    this.speed = NULL_VECTOR;
    this.maxSpeedModule = 0;
  }

  setPosition(x: number, y: number) {
    this.position.x = x;
    this.position.y = y;
  }

  setAngle(angle: number) {
    this.angle = angle;
  }

  setMovementDirection(x: number, y: number) {
    this.speed.x = x * this.maxSpeedModule;
    this.speed.y = y * this.maxSpeedModule;
  }

  resetPosition() {
    this.setPosition(NaN, NaN);
  }

  isOutOfGame() {
    return Number.isNaN(this.position.x);
  }
}
