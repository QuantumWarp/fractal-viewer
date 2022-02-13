import { ColorScheme } from '../color-scheme.interface';
import { ColorSchemeType } from '../color-scheme-type.enum';

export class Bluescale implements ColorScheme {
  type = ColorSchemeType.Bluescale;

  getRed(): number {
    return 0;
  }

  getGreen(): number {
    return 0;
  }

  getBlue(value: number | undefined, maxIterations: number): number {
    if (value === undefined) { return 0; }
    return (255 * value) / maxIterations;
  }

  getAlpha(): number {
    return 255;
  }
}
