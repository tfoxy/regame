import {
  Vector,
} from './vectors';

export default class Entity {
  position: Vector;
  angle: number;
  radius: number;
  speed: Vector;
  maxSpeedModule: number;
  _canvas: HTMLCanvasElement;
  color: string;

  constructor() {
    this.position = { x: NaN, y: NaN };
    this.angle = 0;
    this.radius = 20;
    this.speed = { x: 0, y: 0 };
    this.maxSpeedModule = 250;
    this.color = 'green';
  }

  setPosition(x, y) {
    this.position.x = x;
    this.position.y = y;
  }

  setMovementDirection(x, y) {
    this.speed.x = x * this.maxSpeedModule;
    this.speed.y = y * this.maxSpeedModule;
  }

  get canvas() {
    let canvas = this._canvas;
    if (!canvas) {
      const { radius, position: pos } = this;
      canvas = document.createElement('canvas');
      canvas.width = this.radius * 2;
      canvas.height = this.radius * 2;
      const ctx = canvas.getContext('2d');
      ctx.beginPath();
      ctx.arc(radius, radius, radius, 0, 2 * Math.PI, false);
      ctx.fillStyle = this.color;
      ctx.fill();
      this._canvas = canvas;
    }
    return this._canvas;
  }
}
