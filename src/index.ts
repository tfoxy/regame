/* global document */

import Game from './Game';
import Renderer from './Renderer';
import Controls from './Controls';

import './index.css';

const game = new Game();
game.start();

const controls = new Controls();
controls.setSoldier(game.player);

const renderer = new Renderer();
renderer.start(game);
controls.setCanvas(renderer.canvas);

document.body.appendChild(renderer.canvas);
