import { Component, h } from 'preact';

import Team from '../Team';


interface Props {
  team: Team;
}

export default class TeamStats extends Component<Props, object> {
  constructor(props: Props) {
    super(props);
    const team = props.team;
    team.events.addListener('kill', () => {
      this.forceUpdate();
    });
    team.events.addListener('death', () => {
      this.forceUpdate();
    });
  }

  render() {
    const team = this.props.team;
    return (
      <span class="TeamStats" style={{ color: team.color }}>
        { team.kills }/{ team.deaths }
      </span>
    );
  }
}
