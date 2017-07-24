/* global window */
import Team from './Team';
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
  RELOAD: 'r',
};

export default class LocalControls {
  keyBindings: {
    FORWARD,
    BACKWARD,
    LEFT,
    RIGHT,
    RELOAD,
  };
  team: Team;
  currentKeys: string[];
  currentKeySet: Set<string>;
  currentDirection: string;
  trackedElement: Element;

  constructor(keyBindings = DEFAULT_KEY_BINDINGS) {
    this.keyBindings = keyBindings;
    this.currentKeys = [];
    this.currentKeySet = new Set();
    this.keyboardListener = this.keyboardListener.bind(this);
    this.mouseListener = this.mouseListener.bind(this);
  }

  setTeam(team: Team) {
    if (!this.team) {
      window.addEventListener('keydown', this.keyboardListener);
      window.addEventListener('keyup', this.keyboardListener);
      team.game.events.addListener('loopStart', () => {
        this.team.actionsQueue.delayAction(null);
      });
    }
    this.team = team;
  }

  setMouseTrackerElement(element: Element) {
    this.trackedElement = element;
    element.addEventListener('mousemove', this.mouseListener);
    element.addEventListener('mousedown', this.mouseListener);
    element.addEventListener('mouseup', this.mouseListener);
  }

  private keyboardListener(keyboardEvent: KeyboardEvent) {
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

  private mouseListener(mouseEvent: MouseEvent) {
    const type = mouseEvent.type;
    if (type === 'mousemove') {
      if (document.pointerLockElement === this.trackedElement) {
        this.team.actionsQueue.delayAction({
          name: 'moveFocusPoint',
          args: [mouseEvent.movementX, mouseEvent.movementY],
        });
      } else {
        this.team.actionsQueue.delayAction({
          name: 'setFocusPoint',
          args: [mouseEvent.layerX, mouseEvent.layerY],
        });
      }
    } else if (type === 'mousedown') {
      if (document.pointerLockElement !== this.trackedElement) {
        this.trackedElement.requestPointerLock();
      }
      this.team.actionsQueue.delayAction({
        name: 'setFiring',
        args: [true],
      });
    } else if (type === 'mouseup') {
      this.team.actionsQueue.delayAction({
        name: 'setFiring',
        args: [false],
      });
    }
  }

  private updateCurrentDirection() {
    const {
      FORWARD: forwardKey,
      BACKWARD: backwardKey,
      LEFT: leftKey,
      RIGHT: rightKey,
      RELOAD: reloadKey,
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
        case reloadKey: this.team.actionsQueue.delayAction({
          name: 'reloadWeapon',
          args: null,
        });
      }
    });
    const direction = MOVE_MAP[moveY + moveX];
    if (this.currentDirection === direction) return;
    this.currentDirection = direction;
    this.team.actionsQueue.delayAction({
      name: 'setMovementDirection',
      args: [direction.x, direction.y],
    });
  }
}
