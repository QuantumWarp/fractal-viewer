import { FractalParams } from '../../worker/app-workers/fractals/shared/fractal-params.interface';
import { Coordinate } from '../../worker/app-workers/shared/coordinate';
import { ColorScheme } from '../color-schemes/color-scheme.interface';

export default interface FractalSettings {
  params: FractalParams;

  zoom: number;
  zoomFactor: number;
  center: Coordinate;

  colorScheme: ColorScheme;
  minColorValue: number;
}
