import {
  NULL_VECTOR,
  Vector,
} from '../vectors';
import Entity from './Entity';

export default class Player extends Entity {
  points: Vector[];
  size: Vector;
  _canvas: HTMLCanvasElement;
  private minX: number;
  private maxX: number;
  private minY: number;
  private maxY: number;

  constructor(points: Vector[]) {
    super();
    const xPoints = points.map(p => p.x);
    const yPoints = points.map(p => p.y);
    this.minX = Math.min(...xPoints);
    this.maxX = Math.max(...xPoints);
    this.minY = Math.min(...yPoints);
    this.maxY = Math.max(...yPoints);
    this.position.x = (this.maxX + this.minX) / 2;
    this.position.y = (this.maxY + this.minY) / 2;
    this.size.x = this.maxX - this.minX;
    this.size.y = this.maxY - this.minY;
    this.points = points;
  }

  get canvas() {
    let canvas = this._canvas;
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.width = this.size.x;
      canvas.height = this.size.y;
      const ctx = canvas.getContext('2d');
      ctx.beginPath();
      ctx.moveTo(this.points[0].x - this.minX, this.points[0].y - this.minX);
      this.points.forEach(p => ctx.lineTo(p.x - this.minX, p.y - this.minX));
      ctx.fillStyle = '#AAA';
      ctx.fill();
      this._canvas = canvas;
    }
    return this._canvas;
  }
}
