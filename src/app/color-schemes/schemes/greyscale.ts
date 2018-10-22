import { ColorScheme } from '../color-scheme.interface';
import { ColorSchemeType } from '../color-scheme-type.enum';

export class Greyscale implements ColorScheme {

  type = ColorSchemeType.Greyscale;

  getRed(value: number | undefined, maxIterations: number): number {
    if (value === undefined) { return 0; }
    return 255 * value / maxIterations;
  }

  getGreen(value: number | undefined, maxIterations: number): number {
    if (value === undefined) { return 0; }
    return 255 * value / maxIterations;
  }

  getBlue(value: number | undefined, maxIterations: number): number {
    if (value === undefined) { return 0; }
    return 255 * value / maxIterations;
  }

  getAlpha(value: number | undefined, maxIterations: number): number {
    return 255;
  }
}
