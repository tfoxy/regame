import { Circle as SatCircle, Vector as SatVector } from 'sat';
import {
  Vector,
  angleBetweenTwoVectors,
} from '../vectors';
import Entity from './Entity';
import Fov from '../Fov';
import Team from '../Team';

export default class Soldier extends Entity {
  radius: number;
  speed: Vector;
  focusPoint: Vector;
  private _canvas: HTMLCanvasElement;
  private _fov: Fov;
  private fovUpdatePending: boolean;
  shooting: boolean;
  team: Team;

  constructor() {
    super();
    this.position = { x: NaN, y: NaN };
    this.speed = { x: 0, y: 0 };
    this.radius = 10;
    this.maxSpeedModule = 250;
    this.focusPoint = { x: NaN, y: NaN };
    this.sat = new SatCircle(new SatVector(), this.radius);
    this._fov = new Fov(this);
    this.fovUpdatePending = false;
    this.shooting = false;
  }

  get fov() {
    if (this.fovUpdatePending) {
      this._fov.update();
      this.fovUpdatePending = false;
    }
    return this._fov;
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

  setTeam(team: Team) {
    this.team = team;
  }
}
