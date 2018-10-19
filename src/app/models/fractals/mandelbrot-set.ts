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
    const value = Math.sqrt((coord.x * coord.x) + (coord.y * coord.y));
    return value < this.bound;
  }

  private iterate(coord: Coordinate, initialCoord: Coordinate): Coordinate {
    // Square the current term
    coord.x = (coord.x * coord.x) - (coord.y * coord.y);
    coord.y = 2 * coord.x * coord.y;

    // Add the initial value
    coord.x = coord.x + initialCoord.x;
    coord.y = coord.y + initialCoord.y;

    return coord;
  }
}
