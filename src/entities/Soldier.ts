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
  firing: boolean;
  reload: boolean;
}

class Weapon {
  firing: boolean;
  nextShotFrame: number;
  readonly bulletCooldown: number;
  readonly magazineCapacity: number;
  magazineRounds: number;
  reloadEndingFrame: number;
  readonly reloadTime: number;
  manualReloadStarted: boolean;
  private fireOnNextFrame: boolean;

  constructor() {
    this.bulletCooldown = 8;  // tickrate / 16
    this.magazineCapacity = 16;
    this.reloadTime = 224;  // 1.75 * tickrate
    this.reset();
  }

  get lastShotFrame() {
    return this.nextShotFrame - this.bulletCooldown;
  }

  get reloadStartFrame() {
    return this.reloadEndingFrame - this.reloadTime;
  }

  isReloading(frameNumber: number) {
    return frameNumber < this.reloadEndingFrame;
  }

  setFiring(value: boolean) {
    this.firing = value;
    if (value) {
      this.fireOnNextFrame = true;
    }
  }

  startManualReload(frameNumber: number) {
    if (this.manualReloadStarted) {
      this.manualReloadStarted = false;
      if (!this.isReloading(frameNumber)) {
        this.startReload(frameNumber);
      }
    }
  }

  startReload(frameNumber: number) {
    this.reloadEndingFrame = frameNumber + this.reloadTime;
  }

  finishReload(frameNumber: number) {
    if (frameNumber === this.reloadEndingFrame) {
      this.magazineRounds = this.magazineCapacity;
    }
  }

  shoot(frameNumber: number): boolean {
    if (this.isReloading(frameNumber)) return false;
    if (this.magazineRounds <= 0) return false;
    if (frameNumber < this.nextShotFrame) return false;
    if (!this.fireOnNextFrame) return false;
    this.nextShotFrame = frameNumber + this.bulletCooldown;
    this.magazineRounds -= 1;
    if (this.magazineRounds <= 0) {
      this.startReload(frameNumber);
    }
    if (!this.firing) {
      this.fireOnNextFrame = false;
    }
    return true;
  }

  manualReload() {
    if (this.magazineRounds < this.magazineCapacity) {
      this.manualReloadStarted = true;
    }
  }

  reset() {
    this.firing = false;
    this.fireOnNextFrame = false;
    this.manualReloadStarted = false;
    this.nextShotFrame = 0;
    this.magazineRounds = this.magazineCapacity;
    this.reloadEndingFrame = 0;
  }
}

export default class Soldier extends Entity {
  readonly radius: number;
  readonly focusPoint: Vector;
  private readonly _fov: Fov;
  private fovUpdatePending: boolean;
  team: Team;
  readonly actionsByFrameNumber: Map<number, FrameAction>;
  readonly movementDirection: Vector;
  readonly weapon: Weapon;

  constructor() {
    super();
    this.speed = { x: 0, y: 0 };
    this.radius = 10;
    this.maxSpeedModule = 250;
    this.focusPoint = { x: NaN, y: NaN };
    this.sat = new SatCircle(new SatVector(), this.radius);
    this._fov = new Fov(this);
    this.fovUpdatePending = false;
    this.actionsByFrameNumber = new Map();
    this.movementDirection = { x: 0, y: 0 };
    this.weapon = new Weapon();
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
    if (this.position.x === this.focusPoint.x && this.position.y === this.focusPoint.y) return;
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
      firing: this.weapon.firing,
      reload: this.weapon.manualReloadStarted,
    });
  }

  executeSavedAction(frameNumber: number) {
    const action = this.actionsByFrameNumber.get(frameNumber);
    if (action) {
      this.setMovementDirection(action.movementDirection.x, action.movementDirection.y);
      this.setFocusPoint(action.focusPoint.x, action.focusPoint.y);
      this.setFiring(action.firing);
      if (action.reload) this.reloadWeapon();
    }
  }

  setMovementDirection(x: number, y: number) {
    this.movementDirection.x = x;
    this.movementDirection.y = y;
    super.setMovementDirection(x, y);
    this.saveAction();
  }

  setPosition(x: number, y: number) {
    const { x: prevX, y: prevY } = this.position;
    super.setPosition(x, y);
    this.sat.pos.x = x;
    this.sat.pos.y = y;
    if (Number.isNaN(this.focusPoint.x)) {
      this.focusPoint.x = x;
      this.focusPoint.y = y;
    } else {
      this.focusPoint.x += x - prevX;
      this.focusPoint.y += y - prevY;
    }
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

  moveFocusPoint(x: number, y: number) {
    this.setFocusPoint(this.focusPoint.x + x, this.focusPoint.y + y);
  }

  setFiring(value: boolean) {
    this.weapon.setFiring(value);
    this.saveAction();
  }

  reloadWeapon() {
    this.weapon.manualReload();
  }

  setTeam(team: Team) {
    this.team = team;
  }
}
