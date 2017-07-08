import { Response as SatResponse, testCircleCircle, testPolygonCircle } from 'sat';

import Entity from './entities/Entity';
import Soldier from './entities/Soldier';
import Bullet from './entities/Bullet';
import Wall from './entities/Wall';
import GameMap from './GameMap';

const satResponse = new SatResponse();

export default class Game {
  map: GameMap;
  entities: Entity[];
  tickrate: number;
  loopInterval: number;
  player: Soldier;
  walls: Wall[];
  soldiers: Soldier[];
  bullets: Bullet[];
  
  constructor() {
    this.map = new GameMap();
    this.entities = [];
    this.tickrate = 128;
    this.loopInterval = 1000 / this.tickrate;
    this.player = null;
    this.soldiers = [];
    this.bullets = [];
  }

  start() {
    if (this.loop !== Game.prototype.loop) throw new Error('Game already started');
    this.loadMap();
    this.startRound();
    this.loop = this.loop.bind(this);
    this.loop();
  }

  private loadMap() {
    this.walls = this.map.walls.map(points => new Wall(points));
    this.entities.push(...this.walls);
  }

  private startRound() {
    const soldier = this.addSoldier(this.map.spawnPoints[0]);
    this.player = soldier;
    const secondSoldier = this.addSoldier(this.map.spawnPoints[1]);
    secondSoldier.color = 'red';
  }

  private addSoldier(spawnPoint: { x: number, y: number, angle: number }) {
    const soldier = new Soldier();
    soldier.fov.setMap(this.map);
    soldier.setPosition(spawnPoint.x, spawnPoint.y);
    soldier.setAngle(spawnPoint.angle);
    this.entities.push(soldier);
    this.soldiers.push(soldier);
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
    this.soldiers.forEach(this.loopSoldier, this);
    this.bullets.forEach(this.loopBullet, this);
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
      this.removeEntity(bullet, this.bullets);
      this.removeEntity(collisionSoldier, this.soldiers);
      return;
    }
  }

  private makeShot(soldier: Soldier) {
    if (!soldier.shooting) return;
    const bullet = new Bullet();
    bullet.fireFromSoldier(soldier);
    this.bullets.push(bullet);
    this.entities.push(bullet);
  }
}
