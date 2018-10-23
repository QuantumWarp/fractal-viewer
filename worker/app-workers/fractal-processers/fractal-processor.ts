import { FractalFactory } from '../fractals/shared/fractal-factory';
import { Fractal } from '../fractals/shared/fractal.interface';
import { ProcessFractalStart } from '../messages/process-fractal-start';
import { ComputedPoint } from '../shared/computed-point';
import { Point } from '../shared/point';

export class FractalProcessor {
  private computedCoords: ComputedPoint[] = [];
  private fractal: Fractal<any>;

  public cancelled = false;

  constructor(
    public params: ProcessFractalStart) {
    this.fractal = FractalFactory.create(params.fractalParams);
  }

  process(resultCallback: (points: ComputedPoint[]) => void): void {
    let x = 0;

    while (x < this.params.dimensions.x) {
      let y = 0;

      while (y < this.params.dimensions.y) {
        const point = new Point(x, y);
        const coord = point.toCoordinate(this.params.topLeftCoord, this.params.increment);
        const iterations = this.fractal.calculate(coord);
        this.computedCoords.push(new ComputedPoint(point, iterations));
        if (this.cancelled) { return; }
        y++;
      }

      resultCallback(this.computedCoords);
      this.computedCoords = [];

      x++;
    }
  }
}
