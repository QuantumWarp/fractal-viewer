import { ColorScheme } from './color-scheme.interface';

export class GreenScale implements ColorScheme {

  getRed(value: number | undefined, maxIterations: number): number {
    return 0;
  }

  getGreen(value: number | undefined, maxIterations: number): number {
    if (!value) { return 0; }
    return 50 + (200 * value / maxIterations);
  }

  getBlue(value: number | undefined, maxIterations: number): number {
    return 0;
  }

  getAlpha(value: number | undefined, maxIterations: number): number {
    return 255;
  }
}
