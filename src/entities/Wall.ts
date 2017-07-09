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
}
