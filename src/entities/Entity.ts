import {
  Vector,
} from '../vectors';

export default abstract class Entity {
  position: Vector;
  size: Vector;
  speed: Vector;
  maxSpeedModule: number;
  canvas: HTMLCanvasElement;

  constructor() {
    this.position = { x: NaN, y: NaN };
    this.size = { x: 0, y: 0 };
    this.speed = { x: 0, y: 0 };
    this.maxSpeedModule = 0;
  }

  setPosition(x, y) {
    this.position.x = x;
    this.position.y = y;
  }

  setMovementDirection(x, y) {
    this.speed.x = x * this.maxSpeedModule;
    this.speed.y = y * this.maxSpeedModule;
  }
}
