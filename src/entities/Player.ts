import {
  Vector,
} from '../vectors';
import Entity from './Entity';

export default class Player extends Entity {
  angle: number;
  radius: number;
  speed: Vector;
  _canvas: HTMLCanvasElement;
  color: string;

  constructor() {
    super();
    this.angle = 0;
    this.radius = 20;
    this.maxSpeedModule = 250;
    this.color = 'green';
    this.size.x = this.radius;
    this.size.y = this.radius;
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
