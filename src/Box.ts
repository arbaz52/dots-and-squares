import { TPlayer } from "./Engine";
import Point from "./Point";

export default class Box {
  constructor(public northWest: Point, public player: TPlayer) {}
}
