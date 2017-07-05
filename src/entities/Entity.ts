import {
  Vector,
} from '../vectors';

export default abstract class Entity {
  position: Vector;
  speed: Vector;
  maxSpeedModule: number;
  canvas: HTMLCanvasElement;

  constructor() {
    this.position = { x: NaN, y: NaN };
    this.speed = { x: 0, y: 0 };
    this.maxSpeedModule = 0;
  }

  setMovementDirection(x, y) {
    this.speed.x = x * this.maxSpeedModule;
    this.speed.y = y * this.maxSpeedModule;
  }
}
