import { ProcessFractalStart } from '../messages/process-fractal-start';
import { ComputedPoint } from '../shared/computed-point';
import { Point } from '../shared/point';
import { FractalProcessor } from './fractal-processor';

export class FractalProcessorBlinds extends FractalProcessor {
  constructor(
    public params: ProcessFractalStart,
  ) {
    super(params);
  }

  // Emits results every row
  checkEmitResults(
    count: number,
    resultCallback: (points: ComputedPoint[]) => void,
    force: boolean,
  ): void {
    if (!force && count % this.params.dimensions.y !== 0) { return; }

    resultCallback(this.computedCoords);
    this.computedCoords = [];
  }

  // Method to determine which point should be processed next
  nextPoint(point?: Point): Point | undefined {
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
