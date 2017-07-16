import { Component, h } from 'preact';

import Game from '../Game';
import Renderer from '../Renderer';
import LocalControls from '../LocalControls';
import Team from '../Team';
import TeamStats from './TeamStats';

import './GameUi.css';


interface Props {
  game: Game;
  localControls?: LocalControls;
}

interface State {
  playerTeam: Team;
}


export default class GameUi extends Component<Props, State> {
  renderer: Renderer;
  rootElement: Element;
  canvasElement: HTMLCanvasElement;

  constructor(props) {
    super(props);
    this.renderer = new Renderer();
    this.renderer.setGame(this.props.game);
    if (this.props.localControls) {
      this.renderer.setPovTeam(this.props.localControls.team);
    }
  }

  componentDidMount() {
    this.renderer.setCanvas(this.canvasElement);
    if (this.props.localControls) {
      this.props.localControls.setMouseTrackerElement(this.rootElement);
    }
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
