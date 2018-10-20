export class Coordinate {

  constructor(
    public x: number,
    public y: number,
  ) { }

  clone(): Coordinate {
    return new Coordinate(this.x, this.y);
  }
}
