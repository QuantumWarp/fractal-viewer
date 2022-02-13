import { ColorScheme } from '../color-scheme.interface';
import { ColorSchemeType } from '../color-scheme-type.enum';

export class Greenscale implements ColorScheme {
  type = ColorSchemeType.Greenscale;

  getRed(): number {
    return 0;
  }

  getGreen(value: number | undefined, maxIterations: number): number {
    if (value === undefined) { return 0; }
    return (255 * value) / maxIterations;
  }

  getBlue(): number {
    return 0;
  }

  getAlpha(): number {
    return 255;
  }
}
