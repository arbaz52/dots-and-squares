import Point from "./Point";

export default class Line {
  constructor(public p1: Point, public p2: Point) {}

  getDirection() {
    const x = this.p1.x - this.p2.x;
    const y = this.p1.y - this.p2.y;
    if (y == 1) return "north";

    if (x == -1) return "east";

    if (y == -1) return "south";

    if (x == 1) return "west";

    return undefined;
  }
  isValid() {
    return (
      Math.abs(this.p1.x - this.p2.x) + Math.abs(this.p1.y - this.p2.y) === 1
    );
  }

  isEqual(l: Line) {
    return (
      (this.p1.isEqual(l.p1) && this.p2.isEqual(l.p2)) ||
      (this.p2.isEqual(l.p1) && this.p1.isEqual(l.p2))
    );
  }
}
