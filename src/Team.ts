import Soldier from './entities/Soldier';

export default class Team {
  name: string;
  color: string;
  soldiers: Soldier[];
  kills: number;
  deaths: number;

  constructor(color) {
    this.name = color;
    this.color = color;
    this.soldiers = [];
    this.kills = 0;
    this.deaths = 0;
  }

  addSoldier(soldier: Soldier) {
    soldier.setTeam(this);
    this.soldiers.push(soldier);
  }

  addSoldierDeath(soldier: Soldier) {
    const index = this.soldiers.indexOf(soldier);
    if (index >= 0) this.soldiers.splice(index, 1);
    this.deaths += 1;
  }

  addKill() {
    this.kills += 1;
  }
}
