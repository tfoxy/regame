import Game from './Game';
import Team from './Team';

export interface Action {
  name: string;
  args: any[];
}

export default class ActionsQueue {
  team: Team;
  delay = 8;
  private queue: Action[][];

  constructor(team: Team) {
    this.team = team;
    this.queue = this.createQueue();
  }

  delayAction(action: Action) {
    const frameNumber = this.delay;
    let actions = this.queue[frameNumber];
    if (!actions) {
      actions = [];
      this.queue[frameNumber] = actions;
    }
    if (action) {
      actions.push(action);
    }
  }

  getActions(frameNumber: number) {
    return this.queue[frameNumber - this.team.game.frameNumber];
  }

  setActions(actions: Action[], frameNumber: number) {
    this.queue[frameNumber - this.team.game.frameNumber] = actions;
  }

  hasNext() {
    return Boolean(this.queue[0]);
  }

  executeActions() {
    const actions = this.queue.shift();
    actions.forEach((action) => {
      const soldier = this.team.player;
      soldier[action.name].apply(soldier, action.args);
    });
  }

  private createQueue() {
    const queue = [];
    for (let i = 0; i <= this.delay; i += 1) {
      queue.push([]);
    }
    return queue;
  }
}
