import { ColorScheme } from '../color-scheme.interface';
import { ColorSchemeType } from '../color-scheme-type.enum';

export class AlternatingPrimaryColor implements ColorScheme {
  type = ColorSchemeType.AlternatingPrimaryColor;

  getRed(value: number | undefined, maxIterations: number): number {
    if (value === undefined) { return 0; }
    return (maxIterations - value) % 3 === 0 ? 255 : 0;
  }

  getGreen(value: number | undefined, maxIterations: number): number {
    if (value === undefined) { return 0; }
    return (maxIterations - value) % 3 === 1 ? 255 : 0;
  }

  getBlue(value: number | undefined, maxIterations: number): number {
    if (value === undefined) { return 0; }
    return (maxIterations - value) % 3 === 2 ? 255 : 0;
  }

  getAlpha(): number {
    return 255;
  }
}
