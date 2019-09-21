import { FractalType } from './fractal-type.enum';

export interface FractalParams {
  type: FractalType;

  // TODO: these aren't necessarily on all
  maxIterations: number;
  bound: number;
}
