import { FractalFactory } from '../fractals/shared/fractal-factory';
import { Fractal } from '../fractals/shared/fractal.interface';
import { ProcessFractalInfo } from '../messages/process-fractal-info';
import { ComputedPoint } from '../shared/computed-point';
import { Coordinate } from '../shared/coordinate';

export class FractalProcessor {
  public computedCoords: ComputedPoint[] = [];

  private fractal: Fractal<any>;
  private topLeftCoord: Coordinate;

  constructor(
    public params: ProcessFractalInfo) {
    this.fractal = FractalFactory.create(params.fractalParams);
    this.topLeftCoord = new Coordinate(
      params.center.x - (params.increment * params.width / 2),
      params.center.y - (params.increment * params.height / 2)
    );
  }

  process(resultCallback: (points: ComputedPoint[]) => void): void {
    let x = 0;

    while (x < this.params.width) {
      let y = 0;

      while (y < this.params.height) {
        const coord = this.translateToCoord(x, y);
        const iterations = this.fractal.calculate(coord);
        this.computedCoords.push(new ComputedPoint(x, y, iterations));
        y++;
      }

      resultCallback(this.computedCoords);
      this.computedCoords = [];

      x++;
    }
  }

  private translateToCoord(x: number, y: number): Coordinate {
    return new Coordinate(
      this.topLeftCoord.x + (this.params.increment * x),
      this.topLeftCoord.y + (this.params.increment * y),
    );
  }
}
