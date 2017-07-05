import { Circle as SatCircle, Vector as SatVector } from 'sat';
import {
  Vector,
} from '../vectors';
import Entity from './Entity';

export default class Player extends Entity {
  radius: number;
  speed: Vector;
  _canvas: HTMLCanvasElement;
  color: string;

  constructor() {
    super();
    this.radius = 10;
    this.maxSpeedModule = 250;
    this.color = 'green';
    this.size.x = this.radius;
    this.size.y = this.radius;
    this.sat = new SatCircle(new SatVector(this.position.x, this.position.y), this.radius);
  }

  private setAngleByFocusPoint() {
    if (Number.isNaN(this.focusPoint.x)) return;
    const dx = this.focusPoint.x - this.position.x;
    const dy = this.focusPoint.y - this.position.y;
    const angle = Math.atan2(dy, dx);
    this.setAngle(angle);
  }

  setPosition(x, y) {
    super.setPosition(x, y);
    this.sat.pos.x = x;
    this.sat.pos.y = y;
    this.setAngleByFocusPoint();
  }

  setAngle(angle: number) {
    this.angle = angle;
  }

  setFocusPoint(x, y) {
    this.focusPoint.x = x;
    this.focusPoint.y = y;
    this.setAngleByFocusPoint();
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
      ctx.beginPath();
      ctx.moveTo(radius * 2, radius);
      ctx.lineTo(radius, radius);
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 3;
      ctx.stroke();
      this._canvas = canvas;
    }
    return this._canvas;
  }
}
