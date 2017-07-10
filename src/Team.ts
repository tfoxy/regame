import { EventEmitter2 } from 'eventemitter2';
import Soldier from './entities/Soldier';

export default class Team {
  name: string;
  color: string;
  activeSoldiers: Soldier[];
  allSoldiers: Soldier[];
  kills: number;
  deaths: number;
  events: EventEmitter2;

  constructor(color) {
    this.name = color;
    this.color = color;
    this.activeSoldiers = [];
    this.allSoldiers = [];
    this.kills = 0;
    this.deaths = 0;
    this.events = new EventEmitter2();
  }

  get player() {
    return this.activeSoldiers[this.activeSoldiers.length - 1] || null;
  }

  activateSoldiers() {
    this.activeSoldiers.length = 0;
    this.activeSoldiers.push(...this.allSoldiers);
  }

  addSoldier(soldier: Soldier) {
    soldier.setTeam(this);
    this.allSoldiers.push(soldier);
  }

  addSoldierDeath(soldier: Soldier) {
    const index = this.activeSoldiers.indexOf(soldier);
    if (index >= 0) this.activeSoldiers.splice(index, 1);
    this.deaths += 1;
    this.events.emit('death');
  }

  addKill() {
    this.kills += 1;
    this.events.emit('kill');
  }
}
