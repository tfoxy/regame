/* global document, window */
import Game from './Game';
import Entity from './entities/Entity';
import Player from './entities/Player';

export default class Renderer {
  game: Game;
  canvas: HTMLCanvasElement;
  canvasContext: CanvasRenderingContext2D;

  start(game: Game) {
    if (this.game) throw new Error('Renderer is already rendering a Game');
    this.game = game;
    const canvas = document.createElement('canvas');
    canvas.width = this.game.map.width;
    canvas.height = this.game.map.height;
    this.canvas = canvas;
    this.canvasContext = canvas.getContext('2d');
    this.render = this.render.bind(this);
    this.render();
  }

  render() {
    this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.game.walls.forEach(this.drawEntity, this);
    this.drawFov();
    // this.drawDebugFov(this.game.player);
    this.drawEntity(this.game.player);
    window.requestAnimationFrame(this.render);
  }

  drawEntity(entity: Entity) {
    const { canvas, position, angle } = entity;
    const ctx = this.canvasContext;
    const { width: gameWidth, height: gameHeight } = this.game.map;
    const { x: xPos, y: yPos } = position;
    ctx.translate(xPos, yPos);
    ctx.rotate(angle);
    ctx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);
    ctx.rotate(-angle);
    ctx.translate(-xPos, -yPos);
  }

  drawFov() {
    const intersects = this.game.player.fov.intersects;
    const ctx = this.canvasContext;
    const { globalCompositeOperation, lineWidth, fillStyle } = ctx;

    ctx.beginPath();
    ctx.moveTo(intersects[0].x,intersects[0].y);
    for (let i = 1; i < intersects.length; i += 1) {
      const intersect = intersects[i];
      ctx.lineTo(intersect.x, intersect.y);
    }
    ctx.lineTo(intersects[0].x, intersects[0].y);
    ctx.lineWidth = 10;
    ctx.globalCompositeOperation = 'destination-in';
    ctx.stroke();

    ctx.fillStyle = 'black';
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.beginPath();
    ctx.moveTo(intersects[0].x,intersects[0].y);
    for (let i = 1; i < intersects.length; i += 1) {
      const intersect = intersects[i];
      ctx.lineTo(intersect.x, intersect.y);
    }
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fill();

    ctx.globalCompositeOperation = globalCompositeOperation;
    ctx.lineWidth = lineWidth;
    ctx.fillStyle = fillStyle;
  }

  drawDebugFov(player: Player) {
    const intersects = player.fov.intersects;
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
      ctx.moveTo(player.position.x,player.position.y);
      ctx.lineTo(intersect.x,intersect.y);
      ctx.stroke();
    }
  }
}
