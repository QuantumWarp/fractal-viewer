import { ProcessFractalStart } from '../messages/process-fractal-start';
import { ComputedPoint } from '../shared/computed-point';
import { Point } from '../shared/point';
import { FractalProcessor } from './fractal-processor';

export class FractalProcessorSquare extends FractalProcessor {
  private emitDistance = 1;

  private distance = 0;

  private left = true;

  private right = true;

  private top = true;

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
    if (!force && this.distance !== this.emitDistance) return;

    this.emitDistance += 1;
    resultCallback(this.computedCoords);
    this.computedCoords = [];
  }

  // Method to determine which point should be processed next
  nextPoint(point?: Point): Point | undefined {
    const midpoint = new Point(
      Math.floor(this.params.dimensions.x / 2),
      Math.floor(this.params.dimensions.y / 2),
    );

    if (!point) {
      // Initial point
      return midpoint;
    }

    // Left
    if (!this.left) {
      if (point.y + 1 - midpoint.y <= this.distance) return new Point(point.x, point.y + 1);

      this.left = true;
      return new Point(midpoint.x + this.distance, midpoint.y - this.distance);
    }

    // Right
    if (!this.right) {
      if (point.y + 1 - midpoint.y <= this.distance) return new Point(point.x, point.y + 1);

      this.right = true;
      return new Point(midpoint.x - this.distance, midpoint.y - this.distance);
    }

    // Top
    if (!this.top) {
      if (point.x + 1 - midpoint.x <= this.distance) return new Point(point.x + 1, point.y);

      this.top = true;
      return new Point(midpoint.x - this.distance, midpoint.y + this.distance);
    }

    // Bottom
    if (point.x + 1 - midpoint.x <= this.distance) return new Point(point.x + 1, point.y);

    this.distance += 1;

    if (this.distance > midpoint.x && this.distance > midpoint.y) return undefined;

    this.left = false;
    this.right = false;
    this.top = false;

    return new Point(midpoint.x - this.distance, midpoint.y - this.distance);
  }
}
