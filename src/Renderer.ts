/* global document, window */
import Game from './Game';
import Entity from './entities/Entity';
import Soldier from './entities/Soldier';
import Bullet from './entities/Bullet';
import CanvasFactory from './CanvasFactory';
import Team from './Team';

export default class Renderer {
  game: Game;
  canvas: HTMLCanvasElement;
  private canvasContext: CanvasRenderingContext2D;
  private canvasFactory: CanvasFactory;
  povTeam: Team;

  start(game: Game) {
    if (this.game) throw new Error('Renderer is already rendering a Game');
    this.game = game;
    const canvas = document.createElement('canvas');
    canvas.width = this.game.map.width;
    canvas.height = this.game.map.height;
    this.canvas = canvas;
    this.canvasContext = canvas.getContext('2d');
    this.canvasFactory = new CanvasFactory();
    this.povTeam = this.game.teams[0];
    this.render = this.render.bind(this);
    this.render();
  }

  private render() {
    this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawMap();
    this.drawFogOfWar();
    this.drawSoldiers();
    this.drawBullets();
    window.requestAnimationFrame(this.render);
  }

  private drawMap() {
    const mapCanvas = this.canvasFactory.getGameMapCanvas(this.game.map);
    this.canvasContext.drawImage(mapCanvas, 0, 0);
  }

  private drawSoldiers() {
    const ctx = this.canvasContext;
    ctx.globalCompositeOperation = 'source-over';
    // this.drawDebugFov(this.povTeam.player);
    this.povTeam.activeSoldiers.forEach(this.drawSoldier, this);
    ctx.globalCompositeOperation = 'destination-over';
    this.game.soldiers.forEach(this.drawSoldier, this);
  }

  private drawSoldier(soldier: Soldier) {
    if (soldier.isOutOfGame()) return;
    const canvas = this.canvasFactory.getSoldierCanvas(soldier);
    this.drawEntity(soldier, canvas);
  }

  private drawBullets() {
    const ctx = this.canvasContext;
    ctx.globalCompositeOperation = 'destination-over';
    this.game.bullets.forEach(this.drawBullet, this);
  }

  private drawBullet(bullet: Bullet) {
    if (bullet.isOutOfGame()) return;
    const canvas = this.canvasFactory.getBulletCanvas(bullet);
    this.drawEntity(bullet, canvas);
  }

  private drawEntity(entity: Entity, canvas: HTMLCanvasElement) {
    const { position, angle } = entity;
    const ctx = this.canvasContext;
    const { width: gameWidth, height: gameHeight } = this.game.map;
    const { x: xPos, y: yPos } = position;
    ctx.translate(xPos, yPos);
    ctx.rotate(angle);
    ctx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);
    ctx.rotate(-angle);
    ctx.translate(-xPos, -yPos);
  }

  private drawFogOfWar() {
    const ctx = this.canvasContext;
    const activeSoldiers = this.povTeam.activeSoldiers;

    if (!activeSoldiers.length) {
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      return;
    }

    ctx.beginPath();
    this.povTeam.activeSoldiers.forEach((soldier) => {
      const intersects = soldier.fov.intersects;
      ctx.moveTo(intersects[0].x,intersects[0].y);
      for (let i = 1; i < intersects.length; i += 1) {
        const intersect = intersects[i];
        ctx.lineTo(intersect.x, intersect.y);
      }
      ctx.lineTo(intersects[0].x, intersects[0].y);
    });
    ctx.lineWidth = 10;
    ctx.globalCompositeOperation = 'destination-in';
    ctx.stroke();

    ctx.fillStyle = 'black';
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.beginPath();
    this.povTeam.activeSoldiers.forEach((soldier) => {
      const intersects = soldier.fov.intersects;
      ctx.moveTo(intersects[0].x,intersects[0].y);
      for (let i = 1; i < intersects.length; i += 1) {
        const intersect = intersects[i];
        ctx.lineTo(intersect.x, intersect.y);
      }
    });
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fill();
  }

  private drawDebugFov(soldier: Soldier) {
    const intersects = soldier.fov.intersects;
    const ctx = this.canvasContext;
    ctx.fillStyle = '#dd3838';
    ctx.beginPath();
    ctx.moveTo(intersects[0].x,intersects[0].y);
    for (let i = 1; i < intersects.length; i += 1) {
      const intersect = intersects[i];
      ctx.lineTo(intersect.x, intersect.y);
    }
    ctx.fill();

    // DRAW DEBUG LINES
    ctx.strokeStyle = '#f55';
    for (let i = 0; i < intersects.length; i += 1) {
      const intersect = intersects[i];
      ctx.beginPath();
      ctx.moveTo(soldier.position.x, soldier.position.y);
      ctx.lineTo(intersect.x, intersect.y);
      ctx.stroke();
    }
  }
}
