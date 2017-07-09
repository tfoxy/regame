/* global document */

import GameUi from './GameUi';
import './index.css';

const ui = new GameUi();
ui.startGame();
document.body.appendChild(ui.rootElement);
