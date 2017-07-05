/* global document, window */
import Game from './Game';
import Entity from './entities/Entity';

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

  get width() {
    return this.canvas.width;
  }

  get height() {
    return this.canvas.height;
  }

  render() {
    this.canvasContext.clearRect(0, 0, this.width, this.height);
    this.game.entities.forEach(this.drawEntity, this);
    window.requestAnimationFrame(this.render);
  }

  drawEntity(entity: Entity) {
    const { canvas, position: pos, angle } = entity;
    const ctx = this.canvasContext;
    const { width: gameWidth, height: gameHeight } = this.game.map;
    const { x: xPos, y: yPos } = pos;
    ctx.translate(xPos, yPos);
    ctx.rotate(angle);
    ctx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);
    ctx.rotate(-angle);
    ctx.translate(-xPos, -yPos);
  }
}
