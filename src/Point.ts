export default class Point {
  constructor(public x: number, public y: number) {}

  static getDistance(p1: Point, p2: Point) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  }

  isEqual(p: Point) {
    return this.x === p.x && this.y === p.y;
  }
}
