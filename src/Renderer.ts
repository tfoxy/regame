/* global document, window */
import Game from './Game';
import Entity from './entities/Entity';
import Soldier from './entities/Soldier';
import Bullet from './entities/Bullet';
import CanvasFactory from './CanvasFactory';
import Team from './Team';

const shotSoundUrl = require<string>('./assets/sounds/shot.mp3');
const reloadSoundUrl = require<string>('./assets/sounds/reload.mp3');

export default class Renderer {
  game: Game;
  canvas: HTMLCanvasElement;
  private canvasContext: CanvasRenderingContext2D;
  private canvasFactory: CanvasFactory;
  povTeam: Team;
  private lastRenderedFrame: number;
  private lastRenderedRoundFrame: number;

  setGame(game: Game) {
    if (this.game) throw new Error('Renderer is already rendering a Game');
    this.game = game;
    if (this.canvas) this.startRender();
  }

  setCanvas(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    if (this.game) this.startRender();
  }

  setPovTeam(team: Team) {
    this.povTeam = team;
  }

  private startRender() {
    const canvas = this.canvas;
    canvas.width = this.game.map.width;
    canvas.height = this.game.map.height;
    this.canvasContext = canvas.getContext('2d');
    this.canvasFactory = new CanvasFactory();
    this.lastRenderedFrame = 0;
    this.lastRenderedRoundFrame = 0;
    this.render = this.render.bind(this);
    this.render();
  }

  private render() {
    this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawMap();
    this.drawFogOfWar();
    this.drawSoldiers();
    this.drawBullets();
    this.playSounds();
    this.lastRenderedFrame = this.game.frameNumber;
    this.lastRenderedRoundFrame = this.game.roundFrameNumber;
    window.requestAnimationFrame(this.render);
  }

  private drawMap() {
    const mapCanvas = this.canvasFactory.getGameMapCanvas(this.game.map);
    this.canvasContext.drawImage(mapCanvas, 0, 0);
  }

  private drawSoldiers() {
    const ctx = this.canvasContext;
    if (this.povTeam) {
      // this.drawDebugFov(this.povTeam.player);
      ctx.globalCompositeOperation = 'source-over';
      this.povTeam.activeSoldiers.forEach(this.drawSoldier, this);
      ctx.globalCompositeOperation = 'destination-over';
      ctx.globalAlpha = 0.1;
      ctx.lineWidth = 1;
      ctx.fillStyle = this.povTeam.color;
      ctx.strokeStyle = this.povTeam.color;
      this.povTeam.activeSoldiers.forEach(this.drawFov, this);
      ctx.globalAlpha = 1;
    }
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
    if (!this.povTeam) return;
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
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#f55';
    for (let i = 0; i < intersects.length; i += 1) {
      const intersect = intersects[i];
      ctx.beginPath();
      ctx.moveTo(soldier.position.x, soldier.position.y);
      ctx.lineTo(intersect.x, intersect.y);
      ctx.stroke();
    }
  }

  private drawFov(soldier: Soldier) {
    const intersects = soldier.fov.intersects;
    const ctx = this.canvasContext;
    ctx.beginPath();
    ctx.moveTo(intersects[0].x,intersects[0].y);
    for (let i = 1; i < intersects.length; i += 1) {
      const intersect = intersects[i];
      ctx.lineTo(intersect.x, intersect.y);
    }
    ctx.stroke();
    ctx.fill();
  }

  private playSounds() {
    this.game.soldiers.forEach((soldier) => {
      if (this.lastRenderedRoundFrame <= soldier.weapon.lastShotFrame) {
        const audio = new Audio(shotSoundUrl);
        audio.play();
      }
      if (this.lastRenderedRoundFrame <= soldier.weapon.reloadStartFrame) {
        const audio = new Audio(reloadSoundUrl);
        audio.play();
      }
    });
  }
}
