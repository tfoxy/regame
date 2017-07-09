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
  soldier: Soldier;

  constructor() {
    super();
    this.position = { x: NaN, y: NaN };
    this.speed = { x: NaN, y: NaN };
    this.radius = 2;
    this.maxSpeedModule = 1500;
    this.sat = new SatCircle(new SatVector(), this.radius);
  }

  fireFromSoldier(soldier: Soldier) {
    this.soldier = soldier;
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
}
