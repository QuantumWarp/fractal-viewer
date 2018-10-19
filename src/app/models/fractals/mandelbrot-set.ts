import { Coordinate } from '../coordinate';
import { Fractal } from './fractal.interface';

export class MandelbrotSet implements Fractal {

  constructor(
    public maxIterations: number,
    public bound: number,
  ) { }

  calculate(initialCoord: Coordinate): number | undefined {
    let coord = initialCoord.clone();
    let count = 0;

    while (count < this.maxIterations) {
      coord = this.iterate(coord, initialCoord);

      if (!this.checkIsBounded(coord)) {
        return count;
      }

      count++;
    }

    return undefined;
  }

  private checkIsBounded(coord: Coordinate): boolean {
    // Find the absolute value
    const value = (coord.x * coord.x) + (coord.y * coord.y);
    return value < (this.bound * this.bound);
  }

  private iterate(coord: Coordinate, initialCoord: Coordinate): Coordinate {
    const x = coord.x;
    const y = coord.y;

    // Square the current term
    coord.x = (x * x) - (y * y);
    coord.y = 2 * x * y;

    // Add the initial value
    coord.x = coord.x + initialCoord.x;
    coord.y = coord.y + initialCoord.y;

    return coord;
  }
}
