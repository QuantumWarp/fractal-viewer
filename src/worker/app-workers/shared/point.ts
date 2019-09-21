import { Coordinate } from './coordinate';

// This is used for x, y points (whole numbers)
export class Point {

  constructor(
    public x: number,
    public y: number,
  ) { }

  toCoordinate(topLeftCoord: Coordinate, increment: number): Coordinate {
    return new Coordinate(
      topLeftCoord.x + (increment * this.x),
      topLeftCoord.y + (increment * this.y),
    );
  }
}
