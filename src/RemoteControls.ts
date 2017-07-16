import ConnectionManager from './ConnectionManager';
import Team from './Team';

export default class RemoteControls {
  team: Team;

  constructor(connectionManager: ConnectionManager) {
    connectionManager.events.addListener('dataChannelMessage', (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      // console.log('RX', data.frameNumber, this.team.game.frameNumber);
      if (data.name === 'playerActions') {
        this.team.actionsQueue.setActions(
          data.actions,
          data.frameNumber,
        );
      }
    });
  }

  setTeam(team: Team) {
    this.team = team;
  }
}
