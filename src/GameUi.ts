import Game from './Game';
import Renderer from './Renderer';
import Controls from './Controls';

import './GameUi.css';

const template = `
<div class="GameUi-teamListStats">
  <span id="team1Stats" class="GameUi-teamStats">
    <span id="team1Kills"></span>/<span id="team1Deaths"></span>
  </span>
  <span id="team2Stats" class="GameUi-teamStats">
    <span id="team2Kills"></span>/<span id="team2Deaths"></span>
  </span>
</div>
`;

export default class GameUi {
  rootElement: HTMLElement;
  game: Game;
  controls: Controls;
  renderer: Renderer;

  constructor() {
    this.rootElement = document.createElement('div');
    this.rootElement.className = 'GameUi';
  }

  startGame() {
    if (this.game) throw new Error('GameUi is already playing a Game');

    this.game = new Game();
    this.controls = new Controls();
    this.renderer = new Renderer();

    this.game.start();
    this.controls.setSoldier(this.game.player);
    this.controls.setMouseTrackerElement(this.rootElement);
    this.renderer.start(this.game);

    this.render();
  }

  private render() {
    this.rootElement.innerHTML = template;
    this.rootElement.appendChild(this.renderer.canvas);
    const team1 = this.game.teams[0];
    const team2 = this.game.teams[1];
    this.qs('#team1Stats').style.color = team1.color;
    this.qs('#team2Stats').style.color = team2.color;
    const team1KillsEl = this.qs('#team1Kills');
    const team1DeathsEl = this.qs('#team1Deaths');
    const team2KillsEl = this.qs('#team2Kills');
    const team2DeathsEl = this.qs('#team2Deaths');
    team1KillsEl.textContent = String(team1.kills);
    team1DeathsEl.textContent = String(team1.deaths);
    team2KillsEl.textContent = String(team2.kills);
    team2DeathsEl.textContent = String(team2.deaths);
    team1.events.addListener('kill', () => {
      team1KillsEl.textContent = String(team1.kills);
    });
    team1.events.addListener('death', () => {
      team1DeathsEl.textContent = String(team1.deaths);
    });
    team2.events.addListener('kill', () => {
      team1DeathsEl.textContent = String(team1.kills);
    });
    team2.events.addListener('death', () => {
      team2DeathsEl.textContent = String(team2.deaths);
    });
  }

  private qs(selector: string) {
    return this.rootElement.querySelector(selector) as HTMLElement;
  }
}
