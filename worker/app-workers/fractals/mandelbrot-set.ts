import { Coordinate } from '../shared/coordinate';
import { MandelbrotSetParams } from './mandelbrot-set-params';
import { Fractal } from './shared/fractal.interface';

export class MandelbrotSet implements Fractal<MandelbrotSetParams> {

  constructor(public params: MandelbrotSetParams) { }

  calculate(initialCoord: Coordinate): number | undefined {
    let coord = initialCoord.clone();
    let count = 0;

    while (count < this.params.maxIterations) {
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
    return value < (this.params.bound * this.params.bound);
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
