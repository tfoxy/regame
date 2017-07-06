import { Response as SatResponse, testPolygonCircle } from 'sat';

import Entity from './entities/Entity';
import Player from './entities/Player';
import Wall from './entities/Wall';
import GameMap from './GameMap';

const satResponse = new SatResponse();

export default class Game {
  map: GameMap;
  entities: Entity[];
  tickrate: number;
  loopInterval: number;
  player: Player;
  walls: Wall[];
  
  constructor() {
    this.map = new GameMap();
    this.entities = [];
    this.tickrate = 128;
    this.loopInterval = 1000 / this.tickrate;
    this.player = null;
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
    const player = new Player();
    const spawnPoint = this.map.spawnPoints[0];
    player.setPosition(spawnPoint.x, spawnPoint.y);
    this.entities.push(player);
    this.player = player;
    this.player.fov.setMap(this.map);
    this.player.fov.update();
  }

  private loop() {
    this.entities.forEach(this.loopEntity, this);
    setTimeout(this.loop, this.loopInterval);
  }

  private loopEntity(entity: Entity) {
    this.moveEntity(entity);
  }

  private moveEntity(entity: Entity) {
    const { speed } = entity;
    if (speed.x || speed.y) {
      const pos = entity.position;
      let x = pos.x + (speed.x / this.tickrate);
      let y = pos.y + (speed.y / this.tickrate);
      x = Math.max(x, entity.size.x);
      x = Math.min(x, this.map.width - entity.size.x);
      y = Math.max(y, entity.size.y);
      y = Math.min(y, this.map.height - entity.size.y);
      entity.setPosition(x, y);
      this.checkEntityCollisions(entity);
    }
  }

  private checkEntityCollisions(entity: Entity) {
    let colliding = false;
    let counter = 0;
    do {
      counter += 1;
      colliding = this.entities.some((e) => {
        if (e === entity) return;
        const colliding =
          testPolygonCircle(e.sat, entity.sat, satResponse) && Boolean(satResponse.overlap);
        if (colliding) {
          entity.setPosition(
            entity.position.x + satResponse.overlapV.x,
            entity.position.y + satResponse.overlapV.y,
          );
        }
        satResponse.clear();
        return colliding;
      });
    } while (colliding && counter < 10);
  }
}
