import { Vector } from './vectors';

export default class GameMap {
  height = 800;
  width = 800;
  spawnPoints = [{ x: 50, y: 50, angle: 0 }, { x: 160, y: 50, angle: Math.PI / 2 }];
  walls = [
    [{ x: 400, y: 400 }, { x: 600, y: 400 }, { x: 500, y: 450 }],
    [{ x: 100, y: 0 }, { x: 120, y: 0 }, { x: 120, y: 200 }, { x: 100, y: 200 }],
    [{ x: 0, y: 200 }, { x: 200, y: 250 }, { x: 0, y: 250 }],
  ];
  wallPoints: Vector[];
  wallSegments: { a: Vector, b: Vector }[];

  constructor() {
    const p1 = { x: 0, y: 0 };
    const p2 = { x: this.width, y: 0 };
    const p3 = { x: this.width, y: this.height };
    const p4 = { x: 0, y: this.height };
    this.walls.push(
      [p1, p2],
      [p2, p3],
      [p3, p4],
      [p4, p1],
    );

    const wallPointSet = new Set();
    this.wallPoints = [];
    this.walls.forEach((aWallPoints) => {
      aWallPoints.forEach((p) => {
        const hash = `${p.x},${p.y}`;
        if (!wallPointSet.has(hash)) {
          wallPointSet.add(hash);
          this.wallPoints.push(p);
        }
      });
    });

    this.wallSegments = [];
    this.walls.forEach((aWallPoints) => {
      for (let i = 1; i < aWallPoints.length; i += 1) {
        this.wallSegments.push({ a: aWallPoints[i - 1], b: aWallPoints[i] });
      }
      this.wallSegments.push({ a: aWallPoints[aWallPoints.length - 1], b: aWallPoints[0] });
    });
  }
}
