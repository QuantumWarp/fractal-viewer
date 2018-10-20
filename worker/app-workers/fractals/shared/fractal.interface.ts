import { Coordinate } from '../../shared/coordinate';
import { FractalParams } from './fractal-params.interface';

export interface Fractal<T extends FractalParams> {
  params: T;

  calculate(initialCoord: Coordinate): number | undefined;
}
