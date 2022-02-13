import { Point } from './point';

// This is used for coordinates (decimal numbers)
export class Coordinate {
  constructor(
    public x: number,
    public y: number,
  ) { }

  computeTopLeftCoordinate(dimensions: Point, increment: number): Coordinate {
    return new Coordinate(
      this.x - ((increment * dimensions.x) / 2),
      this.y - ((increment * dimensions.y) / 2),
    );
  }

  clone(): Coordinate {
    return new Coordinate(this.x, this.y);
  }

  static fromPoint(point: Point, topLeftCoord: Coordinate, increment: number): Coordinate {
    return new Coordinate(
      topLeftCoord.x + (increment * point.x),
      topLeftCoord.y + (increment * point.y),
    );
  }
}
