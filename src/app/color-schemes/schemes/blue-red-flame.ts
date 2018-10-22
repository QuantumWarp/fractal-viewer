import { ColorScheme } from '../color-scheme.interface';
import { ColorSchemeType } from '../color-scheme-type.enum';

export class BlueRedFlame implements ColorScheme {

  type = ColorSchemeType.BlueRedFlame;

  getRed(value: number | undefined, maxIterations: number): number {
    if (value === undefined) { return 0; }
    return (Math.sin(3.141 * value / maxIterations + 0.5) / 2 + 0.5) * 255;
  }

  getGreen(value: number | undefined, maxIterations: number): number {
    if (value === undefined) { return 0; }
    return (Math.sin(3.141 * value / maxIterations + 1.5) / 2 + 0.5) * 255;
  }

  getBlue(value: number | undefined, maxIterations: number): number {
    if (value === undefined) { return 0; }
    return (Math.sin(3.141 * value / maxIterations + 2) / 2 + 0.5) * 255;
  }

  getAlpha(value: number | undefined, maxIterations: number): number {
    return 255;
  }
}
