import { Polygon as SatPolygon, Vector as SatVector } from 'sat';
import {
  Vector,
} from '../vectors';
import Entity from './Entity';

export default class Wall extends Entity {
  points: Vector[];
  size: Vector;
  private _canvas: HTMLCanvasElement;
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
    this.position = {
      x: (this.maxX + this.minX) / 2,
      y: (this.maxY + this.minY) / 2,
    };
    this.points = points;
    this.sat = new SatPolygon(
      new SatVector(),
      points.map(p => new SatVector(p.x, p.y)),
    );
  }

  get canvas() {
    let canvas = this._canvas;
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.width = this.maxX - this.minX;
      canvas.height = this.maxY - this.minY;
      const ctx = canvas.getContext('2d');
      ctx.beginPath();
      ctx.moveTo(this.points[0].x - this.minX, this.points[0].y - this.minY);
      this.points.forEach(p => ctx.lineTo(p.x - this.minX, p.y - this.minY));
      ctx.fillStyle = '#AAA';
      ctx.fill();
      this._canvas = canvas;
    }
    return this._canvas;
  }
}
