import { FractalFactory } from '../fractals/shared/fractal-factory';
import { Fractal } from '../fractals/shared/fractal.interface';
import { ProcessFractalStart } from '../messages/process-fractal-start';
import { ComputedPoint } from '../shared/computed-point';
import { Coordinate } from '../shared/coordinate';
import { Point } from '../shared/point';

export abstract class FractalProcessor {
  protected computedCoords: ComputedPoint[] = [];

  private fractal: Fractal<any>;

  constructor(
    public params: ProcessFractalStart,
  ) {
    this.fractal = FractalFactory.create(params.fractalParams);
  }

  // Uses callback rather than EventEmitter to avoid using any dependencies in the Web Worker
  // Calculates and batches the results together
  process(resultCallback: (points: ComputedPoint[]) => void): void {
    let point = this.nextPoint();
    let count = 0;

    while (point) {
      if (this.validPoint(point)) {
        // Find the x, y coordinate from the pixel point coordinate
        const coord = Coordinate.fromPoint(point, this.params.topLeftCoord, this.params.increment);

        const iterations = this.fractal.calculate(coord);
        this.computedCoords.push(new ComputedPoint(point, iterations));

        this.checkEmitResults(count, resultCallback, false);

        count += 1;
      }

      point = this.nextPoint(point);
    }

    this.checkEmitResults(count, resultCallback, true);
  }

  validPoint(point: Point): boolean {
    return point.x >= 0
      && point.x < this.params.dimensions.x
      && point.y >= 0
      && point.y < this.params.dimensions.y;
  }

  // Emits results every row
  abstract checkEmitResults(
    count: number,
    resultCallback: (points: ComputedPoint[]) => void,
    force: boolean,
  ): void;

  // Method to determine which point should be processed next
  abstract nextPoint(point?: Point): Point | undefined;
}
