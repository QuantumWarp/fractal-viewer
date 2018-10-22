import { FractalParams } from './shared/fractal-params.interface';
import { FractalType } from './shared/fractal-type.enum';

export class BurningShipParams implements FractalParams {
  type = FractalType.BurningShip;

  constructor(
    public maxIterations: number,
    public bound: number,
  ) { }
}
