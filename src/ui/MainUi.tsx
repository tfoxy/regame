import { Component, h } from 'preact';

import Game from '../Game';
import GameUi from './GameUi';
import './MainUi.css';

interface State {
  game: Game;
}

export default class MainUi extends Component<object, State> {
  startGame() {
    this.setState({
      game: new Game(),
    });
  }

  render() {
    const game = this.state.game;
    return (
      <div class="MainUi">
        {game ? <GameUi game={game}/> : (
          <button
            type="button"
            class="MainUi-startButton"
            onClick={() => {this.startGame();}}
          >Start</button>
        )}
      </div>
    );
  }
}
