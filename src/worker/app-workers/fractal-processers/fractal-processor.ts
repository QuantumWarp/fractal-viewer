import { FractalFactory } from '../fractals/shared/fractal-factory';
import { Fractal } from '../fractals/shared/fractal.interface';
import { ProcessFractalStart } from '../messages/process-fractal-start';
import { ComputedPoint } from '../shared/computed-point';
import { Point } from '../shared/point';

export class FractalProcessor {
  private computedCoords: ComputedPoint[] = [];
  private fractal: Fractal<any>;

  constructor(
    public params: ProcessFractalStart) {
    this.fractal = FractalFactory.create(params.fractalParams);
  }

  // Uses callback rather than EventEmitter to avoid having to use any dependencies in the Web Worker
  // Calculates and batches the results together
  process(resultCallback: (points: ComputedPoint[]) => void): void {
    let point = this.nextPoint();
    let count = 0;

    while (point) {
      // Find the x, y coordinate from the pixel point coordinate
      const coord = point.toCoordinate(this.params.topLeftCoord, this.params.increment);

      const iterations = this.fractal.calculate(coord);
      this.computedCoords.push(new ComputedPoint(point, iterations));

      this.checkEmitResults(count, resultCallback);

      count++;
      point = this.nextPoint(point);
    }

    this.checkEmitResults(count, resultCallback, true);
  }

  // Emits results every row
  private checkEmitResults(count: number, resultCallback: (points: ComputedPoint[]) => void, force: boolean = false): void {
    if (!force && count % this.params.dimensions.y !== 0) { return; }

    resultCallback(this.computedCoords);
    this.computedCoords = [];
  }

  // Method to determine which point should be processed next
  private nextPoint(point?: Point): Point | undefined {
    const midway = Math.floor(this.params.dimensions.x / 2);

    if (!point) {
      // Initial point
      return new Point(midway, 0);
    }

    // If not at the end of the column increment the y coordinate
    if (point.y !== this.params.dimensions.y - 1) {
      return new Point(point.x, point.y + 1);
    }

    // Since we are at the end of the column determine which column is next
    let newX: number;
    if (point.x >= midway) {
      newX = 2 * midway - point.x - 1;
    } else {
      newX = 2 * midway - point.x;
    }

    // If new column is not out of bounds we return the first y coord in that column
    if (newX !== -1 && newX !== this.params.dimensions.x) {
      return new Point(newX, 0);
    }

    return undefined;
  }
}
