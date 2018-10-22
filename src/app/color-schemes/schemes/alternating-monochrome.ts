import { ColorScheme } from '../color-scheme.interface';
import { ColorSchemeType } from '../color-scheme-type.enum';

export class AlternatingMonochrome implements ColorScheme {

  type = ColorSchemeType.AlternatingMonochrome;

  getRed(value: number | undefined, maxIterations: number): number {
    if (value === undefined) { return 0; }
    return (maxIterations - value) % 2 === 0 ? 200 : 0;
  }

  getGreen(value: number | undefined, maxIterations: number): number {
    if (value === undefined) { return 0; }
    return (maxIterations - value) % 2 === 0  ? 200 : 0;
  }

  getBlue(value: number | undefined, maxIterations: number): number {
    if (value === undefined) { return 0; }
    return (maxIterations - value) % 2 === 0  ? 200 : 0;
  }

  getAlpha(value: number | undefined, maxIterations: number): number {
    return 255;
  }
}
