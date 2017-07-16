import Team from '../Team';

export default class IdleAi {
  team: Team;

  setTeam(team: Team) {
    this.team = team;
    this.team.game.events.addListener('loopStart', () => {
      team.actionsQueue.delayAction(null);
    });
  }
}
