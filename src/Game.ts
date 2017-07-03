import Entity from './Entity';
import GameMap from './GameMap';

export default class Game {
  map: GameMap;
  entities: Entity[];
  tickrate: number;
  loopInterval: number;
  
  constructor() {
    this.map = new GameMap();
    this.entities = [];
    this.tickrate = 128;
    this.loopInterval = 1000 / this.tickrate;
  }

  start() {
    if (this.loop !== Game.prototype.loop) throw new Error('Game already started');
    this.startRound();
    this.loop = this.loop.bind(this);
    this.loop();
  }

  startRound() {
    const entity = new Entity();
    entity.setPosition(0, 0);
    this.entities.push(entity);
  }

  loop() {
    this.entities.forEach(this.moveEntity, this);
    setTimeout(this.loop, this.loopInterval);
  }

  moveEntity(entity) {
    const { speed } = entity;
    if (speed.x || speed.y) {
      const pos = entity.position;
      const x = pos.x + (speed.x / this.tickrate);
      const y = pos.y + (speed.y / this.tickrate);
      entity.setPosition(x, y);
    }
  }
}
