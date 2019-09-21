import { FractalParams } from './shared/fractal-params.interface';
import { FractalType } from './shared/fractal-type.enum';

export class MandelbrotSetParams implements FractalParams {
  type = FractalType.MandelbrotSet;

  constructor(
    public maxIterations: number,
    public bound: number,
  ) { }
}
