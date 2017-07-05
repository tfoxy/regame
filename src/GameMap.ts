export default class GameMap {
  height = 800;
  width = 800;
  spawnPoints = [{ x: 50, y: 50 }];
  walls = [
    [{ x: 400, y: 400 }, { x: 600, y: 400 }, { x: 500, y: 450 }],
    [{ x: 100, y: 0 }, { x: 120, y: 0 }, { x: 120, y: 200 }, { x: 100, y: 200 }],
    [{ x: 0, y: 200 }, { x: 200, y: 250 }, { x: 0, y: 250 }],
  ];
}
