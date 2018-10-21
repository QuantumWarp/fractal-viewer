import { Point } from './point';

// This is used for coordinates (decimal numbers)
export class Coordinate {

  constructor(
    public x: number,
    public y: number,
  ) { }

  computeTopLeftCoordinate(dimensions: Point, increment: number): Coordinate {
    return new Coordinate(
      this.x - (increment * dimensions.x / 2),
      this.y - (increment * dimensions.y / 2)
    );
  }

  clone(): Coordinate {
    return new Coordinate(this.x, this.y);
  }
}
