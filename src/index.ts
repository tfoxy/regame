/* global document */

import Game from './Game';
import Renderer from './Renderer';
import Controls from './Controls';

import './index.css';

const game = new Game();
game.start();

const controls = new Controls();
controls.setEntity(game.entities[0]);

const renderer = new Renderer();
renderer.start(game);

document.body.appendChild(renderer.canvas);
