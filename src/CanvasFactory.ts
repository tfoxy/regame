import Bullet from './entities/Bullet';
import Soldier from './entities/Soldier';
import GameMap from './GameMap';

export default class CanvasFactory {
  private bulletCanvas: HTMLCanvasElement;
  private gameMapCanvas: HTMLCanvasElement;
  private soldierCanvasMap: Map<string, HTMLCanvasElement>;

  constructor() {
    this.soldierCanvasMap = new Map();
  }

  getBulletCanvas(bullet: Bullet): HTMLCanvasElement {
    let canvas = this.bulletCanvas;
    if (!canvas) {
      const radius = bullet.radius;
      canvas = document.createElement('canvas');
      canvas.width = radius * 2;
      canvas.height = radius * 2;
      const ctx = canvas.getContext('2d');
      ctx.beginPath();
      ctx.arc(radius, radius, radius, 0, 2 * Math.PI, false);
      ctx.fillStyle = 'darkorange';
      ctx.fill();
      this.bulletCanvas = canvas;
    }
    return canvas;
  }

  getGameMapCanvas(gameMap: GameMap) {
    let canvas = this.gameMapCanvas;
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.width = gameMap.width;
      canvas.height = gameMap.height;
      const ctx = canvas.getContext('2d');
      ctx.beginPath();
      gameMap.walls.map((wallPoints) => {
        ctx.moveTo(wallPoints[0].x, wallPoints[0].y);
        wallPoints.forEach(p => ctx.lineTo(p.x, p.y));
      });
      ctx.fillStyle = '#AAA';
      ctx.fill();
      this.gameMapCanvas = canvas;
    }
    return canvas;
  }

  getSoldierCanvas(soldier: Soldier) {
    const color = soldier.team.color;
    const isPlayer = soldier.team.player === soldier;
    const hash = `${color}-${isPlayer}`;
    let canvas = this.soldierCanvasMap.get(hash);
    if (!canvas) {
      const radius = soldier.radius;
      canvas = document.createElement('canvas');
      canvas.width = radius * 2;
      canvas.height = radius * 2;
      const ctx = canvas.getContext('2d');
      ctx.beginPath();
      ctx.arc(radius, radius, radius, 0, 2 * Math.PI, false);
      ctx.fillStyle = color;
      ctx.fill();
      if (isPlayer) {
        ctx.beginPath();
        ctx.arc(radius, radius, radius - 5, 0, 2 * Math.PI, false);
        ctx.strokeStyle = 'yellow';
        ctx.lineWidth = 3;
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.moveTo(radius * 2, radius);
      ctx.lineTo(radius, radius);
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 3;
      ctx.stroke();
      this.soldierCanvasMap.set(hash, canvas);
    }
    return canvas;
  }
}
