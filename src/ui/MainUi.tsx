import { Component, h } from 'preact';

import Game from '../Game';
import ConnectionManager from '../ConnectionManager';
import LocalControls from '../LocalControls';
import RemoteControls from '../RemoteControls';
import IdleAi from '../ai/IdleAi';
import GameUi from './GameUi';
import MultiplayerMenu from './MultiplayerMenu';
import './MainUi.css';

interface State {
  game: Game;
  localControls: LocalControls;
}

export default class MainUi extends Component<object, State> {
  constructor(props) {
    super(props);
    this.onConnectionStarted = this.onConnectionStarted.bind(this);
  }

  startLocalGame() {
    const game = new Game();
    game.start();
    const localControls = new LocalControls();
    localControls.setTeam(game.teams[0]);
    const ai = new IdleAi();
    ai.setTeam(game.teams[1]);
    this.setState({ game, localControls });
  }

  onConnectionStarted(connectionManager: ConnectionManager) {
    const game = new Game();
    game.start();
    const localControls = new LocalControls();
    if (Number.isNaN(connectionManager.localTeamIndex)) throw Error('connectionManager Error');
    const localTeam = game.teams[connectionManager.localTeamIndex];
    localControls.setTeam(localTeam);
    const remoteTeam = game.teams[connectionManager.remoteTeamIndex];
    const remoteControls = new RemoteControls(connectionManager);
    remoteControls.setTeam(remoteTeam);
    game.events.addListener('loopStart', () => {
      const frameNumber = game.frameNumber + localTeam.actionsQueue.delay;
      const actions = localTeam.actionsQueue.getActions(frameNumber);
      // console.log('TX', frameNumber, game.frameNumber);
      connectionManager.sendData(JSON.stringify({
        actions,
        frameNumber,
        name: 'playerActions',
      }));
    });
    this.setState({ game, localControls });
  }

  render() {
    const game = this.state.game;
    return (
      <div class="MainUi">
        {game ? <GameUi
          game={game}
          localControls={this.state.localControls}
        /> : this.renderMenu()}
      </div>
    );
  }

  private renderMenu() {
    return (
      <div class="MainUi-menu">
        <div>
          <button
            type="button"
            class="MainUi-startButton"
            onClick={() => {this.startLocalGame();}}
          >Start</button>
        </div>
        <div>
          <MultiplayerMenu
            onConnectionStarted={this.onConnectionStarted}
          />
        </div>
      </div>
    );
  }
}
