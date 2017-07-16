import { Circle as SatCircle, Vector as SatVector } from 'sat';
import {
  Vector,
  angleBetweenTwoVectors,
} from '../vectors';
import Entity from './Entity';
import Fov from '../Fov';
import Team from '../Team';

interface FrameAction {
  movementDirection: Vector;
  focusPoint: Vector;
  shooting: boolean;
}

export default class Soldier extends Entity {
  radius: number;
  speed: Vector;
  focusPoint: Vector;
  private _canvas: HTMLCanvasElement;
  private _fov: Fov;
  private fovUpdatePending: boolean;
  shooting: boolean;
  team: Team;
  actionsByFrameNumber: Map<number, FrameAction>;
  movementDirection: Vector;

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
    this.actionsByFrameNumber = new Map();
    this.movementDirection = { x: 0, y: 0 };
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

  private saveAction() {
    const team = this.team;
    if (!team) return;
    if (team.player !== this) return;
    const game = team.game;
    if (!game) return;
    const frameNumber = game.roundFrameNumber;
    this.actionsByFrameNumber.set(frameNumber, {
      movementDirection: { x: this.movementDirection.x, y: this.movementDirection.y },
      focusPoint: { x: this.focusPoint.x, y: this.focusPoint.y },
      shooting: this.shooting,
    });
  }

  executeSavedAction(frameNumber: number) {
    const action = this.actionsByFrameNumber.get(frameNumber);
    if (action) {
      this.setMovementDirection(action.movementDirection.x, action.movementDirection.y);
      this.setFocusPoint(action.focusPoint.x, action.focusPoint.y);
      if (action.shooting) this.startShooting();
      else this.stopShooting();
    }
  }

  setMovementDirection(x: number, y: number) {
    this.movementDirection.x = x;
    this.movementDirection.y = y;
    super.setMovementDirection(x, y);
    this.saveAction();
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
    this.saveAction();
  }

  startShooting() {
    this.shooting = true;
    this.saveAction();
  }

  stopShooting() {
    this.shooting = false;
    this.saveAction();
  }

  setTeam(team: Team) {
    this.team = team;
  }
}
