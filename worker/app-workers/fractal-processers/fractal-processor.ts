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

  process(resultCallback: (points: ComputedPoint[]) => void): void {
    let point = this.nextPoint();
    let count = 0;

    while (point) {
      const coord = point.toCoordinate(this.params.topLeftCoord, this.params.increment);
      const iterations = this.fractal.calculate(coord);
      this.computedCoords.push(new ComputedPoint(point, iterations));

      this.checkEmitResults(count, resultCallback);

      count++;
      point = this.nextPoint(point);
    }

    this.checkEmitResults(count, resultCallback, true);
  }

  private checkEmitResults(count: number, resultCallback: (points: ComputedPoint[]) => void, force: boolean = false): void {
    if (force || count % this.params.dimensions.y === 0) {
      resultCallback(this.computedCoords);
      this.computedCoords = [];
    }
  }

  private nextPoint(point?: Point): Point | undefined {
    const midway = Math.floor(this.params.dimensions.x / 2);

    if (!point) {
      return new Point(midway, 0);
    }

    if (point.y !== this.params.dimensions.y - 1) {
      return new Point(point.x, point.y + 1);
    }

    let newX: number;
    if (point.x >= midway) {
      newX = 2 * midway - point.x - 1;
    } else {
      newX = 2 * midway - point.x;
    }

    if (newX === -1 || newX === this.params.dimensions.x) {
      return undefined;
    } else {
      return new Point(newX, 0);
    }
  }
}
