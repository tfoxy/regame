import { Component, h } from 'preact';

import Game from '../Game';
import Renderer from '../Renderer';
import Controls from '../Controls';
import Team from '../Team';
import TeamStats from './TeamStats';

import './GameUi.css';


interface Props {
  game: Game;
}

interface State {
  playerTeam: Team;
}


export default class GameUi extends Component<Props, State> {
  controls: Controls;
  renderer: Renderer;
  rootElement: Element;
  canvasElement: HTMLCanvasElement;

  constructor(props) {
    super(props);
    this.startGame();
  }

  startGame() {
    const game = this.props.game;
    this.controls = new Controls();
    this.renderer = new Renderer();

    game.start();
    const playerTeam = game.teams[0];
    this.controls.setSoldier(playerTeam.player);
    game.events.addListener('roundStarted', () => {
      this.controls.setSoldier(playerTeam.player);
    });
    this.renderer.setGame(game);

    this.state.playerTeam = playerTeam;
  }

  componentDidMount() {
    this.controls.setMouseTrackerElement(this.rootElement);
    this.renderer.setCanvas(this.canvasElement);
  }

  render() {
    const game = this.props.game;
    return (
      <div
        class="GameUi"
        ref={(el) => { this.rootElement = el; }}
        >
        <div class="GameUi-teamListStats">
          {game.teams.map(team => (
            <span class="GameUi-teamStats"><TeamStats team={team} /></span>
          ))}
        </div>
        <canvas ref={(el) => { this.canvasElement = el as HTMLCanvasElement; }}/>
      </div>
    );
  }
}
