import { ColorScheme } from '../color-scheme.interface';
import { ColorSchemeType } from '../color-scheme-type.enum';

export class Bluescale implements ColorScheme {

  type = ColorSchemeType.Bluescale;

  getRed(value: number | undefined, maxIterations: number): number {
    return 0;
  }

  getGreen(value: number | undefined, maxIterations: number): number {
    return 0;
  }

  getBlue(value: number | undefined, maxIterations: number): number {
    if (!value) { return 0; }
    return 255 * value / maxIterations;
  }

  getAlpha(value: number | undefined, maxIterations: number): number {
    return 255;
  }
}
