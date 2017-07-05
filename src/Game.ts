import Entity from './entities/Entity';
import Player from './entities/Player';
import Wall from './entities/Wall';
import GameMap from './GameMap';

export default class Game {
  map: GameMap;
  entities: Entity[];
  tickrate: number;
  loopInterval: number;
  player: Player;
  
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

  loadMap() {
    this.entities.push(...this.map.walls.map(points => new Wall(points)));
  }

  startRound() {
    const player = new Player();
    const spawnPoint = this.map.spawnPoints[0];
    player.setPosition(spawnPoint.x, spawnPoint.y);
    this.entities.push(player);
    this.player = player;
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
