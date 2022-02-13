import { ColorScheme } from '../color-scheme.interface';
import { ColorSchemeType } from '../color-scheme-type.enum';

export class Redscale implements ColorScheme {
  type = ColorSchemeType.Redscale;

  getRed(value: number | undefined, maxIterations: number): number {
    if (value === undefined) { return 0; }
    return (255 * value) / maxIterations;
  }

  getGreen(): number {
    return 0;
  }

  getBlue(): number {
    return 0;
  }

  getAlpha(): number {
    return 255;
  }
}
