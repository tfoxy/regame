import { Circle as SatCircle, Vector as SatVector } from 'sat';
import Entity from './Entity';
import Soldier from './Soldier';
import {
  Vector,
  polarToCartesian,
} from '../vectors';

export default class Bullet extends Entity {
  radius: number;
  speed: Vector;
  private _canvas: HTMLCanvasElement;

  constructor() {
    super();
    this.position = { x: NaN, y: NaN };
    this.speed = { x: NaN, y: NaN };
    this.radius = 3;
    this.maxSpeedModule = 1500;
    this.sat = new SatCircle(new SatVector(), this.radius);
  }

  fireFromSoldier(soldier: Soldier) {
    this.setAngle(soldier.angle);
    const bulletDiffPos = polarToCartesian(soldier.radius - this.radius, this.angle);
    this.setPosition(
      soldier.position.x + bulletDiffPos.x,
      soldier.position.y + bulletDiffPos.y,
    );
    const movementDirection = polarToCartesian(1, this.angle);
    this.setMovementDirection(movementDirection.x, movementDirection.y);
  }

  setPosition(x: number, y: number) {
    super.setPosition(x, y);
    this.sat.pos.x = x;
    this.sat.pos.y = y;
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
      ctx.fillStyle = 'orange';
      ctx.fill();
      this._canvas = canvas;
    }
    return this._canvas;
  }
}
