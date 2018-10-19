import { Coordinate } from '../coordinate';

export interface Fractal {
  maxIterations: number;
  bound: number;

  calculate(initialCoord: Coordinate): number | undefined;
}
