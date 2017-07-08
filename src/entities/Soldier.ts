import { Circle as SatCircle, Vector as SatVector } from 'sat';
import {
  Vector,
  angleBetweenTwoVectors,
} from '../vectors';
import Entity from './Entity';
import Fov from '../Fov';

export default class Soldier extends Entity {
  radius: number;
  speed: Vector;
  focusPoint: Vector;
  private _canvas: HTMLCanvasElement;
  color: string;
  private _fov: Fov;
  private fovUpdatePending: boolean;
  shooting: boolean;

  constructor() {
    super();
    this.position = { x: NaN, y: NaN };
    this.speed = { x: 0, y: 0 };
    this.radius = 10;
    this.maxSpeedModule = 250;
    this.color = 'blue';
    this.focusPoint = { x: NaN, y: NaN };
    this.sat = new SatCircle(new SatVector(), this.radius);
    this._fov = new Fov(this);
    this.fovUpdatePending = false;
    this.shooting = false;
  }

  private setAngleByFocusPoint() {
    if (Number.isNaN(this.focusPoint.x)) return;
    const angle = angleBetweenTwoVectors(this.position, this.focusPoint);
    this.setAngle(angle);
  }

  setPosition(x: number, y: number) {
    super.setPosition(x, y);
    this.sat.pos.x = x;
    this.sat.pos.y = y;
    this.setAngleByFocusPoint();
    this.fovUpdatePending = true;
  }

  setAngle(angle: number) {
    super.setAngle(angle);
    this.fovUpdatePending = true;
  }

  setFocusPoint(x: number, y: number) {
    this.focusPoint.x = x;
    this.focusPoint.y = y;
    this.setAngleByFocusPoint();
  }

  startShooting() {
    this.shooting = true;
  }

  stopShooting() {
    this.shooting = false;
  }

  get fov() {
    if (this.fovUpdatePending) {
      this._fov.update();
      this.fovUpdatePending = false;
    }
    return this._fov;
  }

  get canvas() {
    let canvas = this._canvas;
    if (!canvas) {
      const { radius, position: pos } = this;
      canvas = document.createElement('canvas');
      canvas.width = radius * 2;
      canvas.height = radius * 2;
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
