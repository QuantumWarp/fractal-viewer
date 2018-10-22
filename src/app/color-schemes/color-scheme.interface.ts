import { ColorSchemeType } from './color-scheme-type.enum';

export interface ColorScheme {
  type: ColorSchemeType;
  getRed(value: number | undefined, maxIterations: number): number;
  getGreen(value: number | undefined, maxIterations: number): number;
  getBlue(value: number | undefined, maxIterations: number): number;
  getAlpha(value: number | undefined, maxIterations: number): number;
}
