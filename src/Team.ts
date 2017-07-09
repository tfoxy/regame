import { EventEmitter2 } from 'eventemitter2';
import Soldier from './entities/Soldier';

export default class Team {
  name: string;
  color: string;
  soldiers: Soldier[];
  kills: number;
  deaths: number;
  events: EventEmitter2;

  constructor(color) {
    this.name = color;
    this.color = color;
    this.soldiers = [];
    this.kills = 0;
    this.deaths = 0;
    this.events = new EventEmitter2();
  }

  addSoldier(soldier: Soldier) {
    soldier.setTeam(this);
    this.soldiers.push(soldier);
  }

  addSoldierDeath(soldier: Soldier) {
    const index = this.soldiers.indexOf(soldier);
    if (index >= 0) this.soldiers.splice(index, 1);
    this.deaths += 1;
    this.events.emit('death');
  }

  addKill() {
    this.kills += 1;
    this.events.emit('kill');
  }
}
