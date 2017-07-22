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
    const team = this.props.localControls ? this.props.localControls.team : null;
    return (
      <div
        class="GameUi"
        ref={(el) => { this.rootElement = el; }}
        >
        <canvas ref={(el) => { this.canvasElement = el as HTMLCanvasElement; }}/>
        <div class="GameUi-gameStats">
          <div class="GameUi-teamListStats">
            {game.teams.map(team => (
              <span
                class="GameUi-teamStats"
                style={{ backgroundColor: team.color }}
              ><TeamStats team={team}/></span>
            ))}
          </div>
          <div class="GameUi-timeLeft"
          ><TimeLeft game={game}/></div>
          <div class="GameUi-soldierAmmo"
          ><SoldierAmmo team={team}/></div>
        </div>
      </div>
    );
  }
}


class TimeLeft extends Component<{game: Game}, {timeLeft: number}> {
  constructor(props) {
    super(props);
    this.state.timeLeft = 0;
    this.updateTime = this.updateTime.bind(this);
    this.props.game.events.addListener('loopStart', this.updateTime);
  }

  updateTime() {
    const game = this.props.game;
    const timeLeft = Math.ceil((game.maxRoundFrames - game.roundFrameNumber) / game.tickrate);
    if (timeLeft !== this.state.timeLeft) {
      this.setState({ timeLeft });
    }
  }

  render() {
    return <span>{this.state.timeLeft}</span>;
  }
}


class SoldierAmmo extends Component<{team: Team}, {ammoLeft: number, ammoCapacity: number}> {
  constructor(props) {
    super(props);
    this.setState({
      ammoLeft: 0,
      ammoCapacity: 0,
    });
    this.props.team.game.events.addListener('loopStart', () => {
      const weapon = this.props.team.player.weapon;
      if (
        this.state.ammoLeft !== weapon.magazineRounds ||
        this.state.ammoCapacity !== weapon.magazineCapacity
      ) {
        this.setState({
          ammoLeft: weapon.magazineRounds,
          ammoCapacity: weapon.magazineCapacity,
        });
      }
    });
  }

  render() {
    return <span>{this.state.ammoLeft}/{this.state.ammoCapacity}</span>;
  }
}

