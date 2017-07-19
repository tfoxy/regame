import { Response as SatResponse, testCircleCircle, testPolygonCircle } from 'sat';
import { EventEmitter2 } from 'eventemitter2';

import Entity from './entities/Entity';
import Soldier from './entities/Soldier';
import Bullet from './entities/Bullet';
import Wall from './entities/Wall';
import GameMap from './GameMap';
import Team from './Team';

const satResponse = new SatResponse();

const TEAM_COLORS = [
  'royalblue',
  'red',
  'green',
  'orange',
  'cyan',
  'purple',
];

export default class Game {
  map: GameMap;
  entities: Entity[];
  tickrate: number;
  loopInterval: number;
  walls: Wall[];
  soldiers: Soldier[];
  bullets: Bullet[];
  teams: Team[];
  events: EventEmitter2;
  frameNumber: number;
  restartRoundFlag: boolean;
  round: number;
  roundFrameNumber: number;

  constructor() {
    this.map = new GameMap();
    this.entities = [];
    this.tickrate = 128;
    this.loopInterval = 1000 / this.tickrate;
    this.soldiers = [];
    this.bullets = [];
    this.teams = [];
    this.events = new EventEmitter2();
    this.restartRoundFlag = false;
  }

  start() {
    if (this.loop !== Game.prototype.loop) throw new Error('Game already started');
    this.loadMap();
    this.createTeams();
    this.round = 0;
    this.frameNumber = 0;
    this.startRound();
    this.loop = this.loop.bind(this);
    setTimeout(this.loop, this.loopInterval);
  }

  private loadMap() {
    this.walls = this.map.walls.map(points => new Wall(points));
    this.entities.push(...this.walls);
  }

  private createTeams() {
    this.teams.push(...this.map.spawnPoints.map((p, i) => new Team(TEAM_COLORS[i])));
    this.teams.forEach(t => t.setGame(this));
  }

  private startRound() {
    this.teams.forEach((team) => {
      team.activeSoldiers.forEach((soldier) => {
        soldier.setFiring(false);
      });
    });
    this.roundFrameNumber = 0;
    this.round += 1;
    this.entities.length = 0;
    this.soldiers.length = 0;
    this.bullets.length = 0;
    this.map.spawnPoints.forEach((spawnPoint, index) => {
      this.addSoldier(this.teams[index]);
    });
    this.teams.forEach((team, i) => {
      const spawnPoint = this.map.spawnPoints[i];
      team.activateSoldiers();
      team.activeSoldiers.forEach((soldier) => {
        soldier.setPosition(spawnPoint.x, spawnPoint.y);
        soldier.setAngle(spawnPoint.angle);
        soldier.setMovementDirection(0, 0);
        soldier.weapon.reset();
        this.entities.push(soldier);
        this.soldiers.push(soldier);
      });
    });
    this.events.emit('roundStart');
  }

  private addSoldier(team: Team) {
    const soldier = new Soldier();
    team.addSoldier(soldier);
    soldier.fov.setMap(this.map);
    return soldier;
  }

  private removeEntity(entity: Entity, array: Entity[]) {
    entity.resetPosition();
    const aIndex = array.indexOf(entity);
    if (aIndex >= 0) array.splice(aIndex, 1);
    const eIndex = this.entities.indexOf(entity);
    if (eIndex >= 0) this.entities.splice(eIndex, 1);
  }

  private loop() {
    if (this.teams.every(t => t.actionsQueue.hasNext())) {
      this.events.emit('loopStart');
      this.teams.forEach(t => t.actionsQueue.executeActions());
      this.soldiers.forEach(this.loopSoldier, this);
      this.bullets.forEach(this.loopBullet, this);
      this.frameNumber += 1;
      this.roundFrameNumber += 1;
      if (this.restartRoundFlag) {
        this.restartRoundFlag = false;
        this.startRound();
      }
    }
    setTimeout(this.loop, this.loopInterval);
  }

  private moveEntity(entity: Entity) {
    const pos = entity.position;
    let x = pos.x + (entity.speed.x / this.tickrate);
    let y = pos.y + (entity.speed.y / this.tickrate);
    x = Math.max(x, 0);
    x = Math.min(x, this.map.width);
    y = Math.max(y, 0);
    y = Math.min(y, this.map.height);
    entity.setPosition(x, y);
  }

  private loopSoldier(soldier: Soldier) {
    soldier.executeSavedAction(this.roundFrameNumber);
    if (soldier.speed.x || soldier.speed.y) {
      this.moveEntity(soldier);
      this.checkSoldierCollisions(soldier);
    }
    this.makeShot(soldier);
  }

  private loopBullet(bullet: Bullet) {
    this.moveEntity(bullet);
    this.checkBulletCollisions(bullet);
  }

  private checkSoldierCollisions(soldier: Soldier) {
    let colliding = false;
    let counter = 0;
    do {
      counter += 1;
      colliding = this.walls.some((e) => {
        const colliding =
          testPolygonCircle(e.sat, soldier.sat, satResponse) && Boolean(satResponse.overlap);
        if (colliding) {
          soldier.setPosition(
            soldier.position.x + satResponse.overlapV.x,
            soldier.position.y + satResponse.overlapV.y,
          );
        }
        satResponse.clear();
        return colliding;
      });
    } while (colliding && counter < 10);
  }

  private checkBulletCollisions(bullet: Bullet) {
    const collisionWall = this.walls.find(wall => testPolygonCircle(wall.sat, bullet.sat));
    if (collisionWall) {
      this.removeEntity(bullet, this.bullets);
      return;
    }
    const collisionSoldier = this.soldiers.find(
      soldier => testCircleCircle(soldier.sat, bullet.sat),
    );
    if (collisionSoldier) {
      collisionSoldier.setMovementDirection(0, 0);
      collisionSoldier.setFiring(false);
      collisionSoldier.weapon.reset();
      this.removeEntity(bullet, this.bullets);
      this.removeEntity(collisionSoldier, this.soldiers);
      collisionSoldier.team.addSoldierDeath(collisionSoldier);
      if (bullet.soldier.team !== collisionSoldier.team) {
        bullet.soldier.team.addKill();
      }
      if (this.teams.some(team => team.activeSoldiers.length === 0)) {
        this.restartRoundFlag = true;
      }
    }
  }

  private makeShot(soldier: Soldier) {
    soldier.weapon.finishReload(this.roundFrameNumber);
    if (!soldier.weapon.shoot(this.roundFrameNumber)) return;
    const bullet = new Bullet();
    bullet.fireFromSoldier(soldier);
    this.bullets.push(bullet);
    this.entities.push(bullet);
  }
}
