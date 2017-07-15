/* global window */
import Soldier from './entities/Soldier';
import {
  NULL_VECTOR,
} from './vectors';

const SQRT2 = 1 / Math.sqrt(2);

const UP = { x: 0, y: -1 };
const DOWN = { x: 0, y: 1 };
const LEFT = { x: -1, y: 0 };
const RIGHT = { x: 1, y: 0 };
const UP_LEFT = { x: -SQRT2, y: -SQRT2 };
const UP_RIGHT = { x: SQRT2, y: -SQRT2 };
const DOWN_LEFT = { x: -SQRT2, y: SQRT2 };
const DOWN_RIGHT = { x: SQRT2, y: SQRT2 };

/*
  N: North
  S: South
  W: West
  E: East
  X: None of the above (idle)
 */
const MOVE_MAP = {
  NX: UP,
  SX: DOWN,
  XW: LEFT,
  XE: RIGHT,
  NW: UP_LEFT,
  NE: UP_RIGHT,
  SW: DOWN_LEFT,
  SE: DOWN_RIGHT,
  XX: NULL_VECTOR,
};

export interface KeyBindings {
  FORWARD: string;
  BACKWARD: string;
  LEFT: string;
  RIGHT: string;
}

const DEFAULT_KEY_BINDINGS = {
  FORWARD: 'w',
  BACKWARD: 's',
  LEFT: 'a',
  RIGHT: 'd',
};

export default class Controls {
  keyBindings: {
    FORWARD,
    BACKWARD,
    LEFT,
    RIGHT,
  };
  soldier: Soldier;
  currentKeys: string[];
  currentKeySet: Set<string>;

  constructor(keyBindings = DEFAULT_KEY_BINDINGS) {
    this.keyBindings = keyBindings;
    this.soldier = null;
    this.currentKeys = [];
    this.currentKeySet = new Set();
    this.keyboardListener = this.keyboardListener.bind(this);
    this.mouseListener = this.mouseListener.bind(this);
  }

  setSoldier(soldier: Soldier) {
    if (!this.soldier) {
      window.addEventListener('keydown', this.keyboardListener);
      window.addEventListener('keyup', this.keyboardListener);
    }
    this.soldier = soldier;
  }

  setMouseTrackerElement(element: Element) {
    element.addEventListener('mousemove', this.mouseListener);
    element.addEventListener('mousedown', this.mouseListener);
    element.addEventListener('mouseup', this.mouseListener);
  }

  keyboardListener(keyboardEvent: KeyboardEvent) {
    const { key, type } = keyboardEvent;
    if (type === 'keydown' && !this.currentKeySet.has(key)) {
      this.currentKeys.push(key);
      this.currentKeySet.add(key);
    } else if (type === 'keyup' && this.currentKeySet.delete(key)) {
      const index = this.currentKeys.indexOf(key);
      this.currentKeys.splice(index, 1);
    }
    this.updateCurrentDirection();
  }

  mouseListener(mouseEvent: MouseEvent) {
    const type = mouseEvent.type;
    if (type === 'mousemove') {
      this.soldier.setFocusPoint(mouseEvent.offsetX, mouseEvent.offsetY);
    } else if (type === 'mousedown') {
      this.soldier.startShooting();
    } else if (type === 'mouseup') {
      this.soldier.stopShooting();
    }
  }

  updateCurrentDirection() {
    const {
      FORWARD: forwardKey,
      BACKWARD: backwardKey,
      LEFT: leftKey,
      RIGHT: rightKey,
    } = this.keyBindings;
    let moveX = 'X';
    let moveY = 'X';
    this.currentKeys.forEach((key) => {
      // eslint-disable-next-line default-case
      switch (key) {
        case forwardKey: moveY = 'N'; break;
        case backwardKey: moveY = 'S'; break;
        case leftKey: moveX = 'W'; break;
        case rightKey: moveX = 'E'; break;
      }
    });
    const direction = MOVE_MAP[moveY + moveX];
    this.soldier.setMovementDirection(direction.x, direction.y);
  }
}
