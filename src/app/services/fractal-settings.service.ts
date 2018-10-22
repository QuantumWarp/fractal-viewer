import { EventEmitter } from '@angular/core';
import { Coordinate } from 'worker/app-workers/shared/coordinate';

import { MandelbrotSetParams } from '../../../worker/app-workers/fractals/mandelbrot-set-params';
import { FractalParams } from '../../../worker/app-workers/fractals/shared/fractal-params.interface';
import { Point } from '../../../worker/app-workers/shared/point';
import { ColorSchemeFactory } from '../color-schemes/color-scheme-factory';
import { ColorSchemeType } from '../color-schemes/color-scheme-type.enum';

export class FractalSettingsService {
  private defaultPixelSize = 0.005;

  updated = new EventEmitter();

  get increment(): number {
    return this.defaultPixelSize / this.zoom;
  }

  dimensions: Point;

  // Settings
  zoomFactor = 2;

  colorScheme = ColorSchemeFactory.create(ColorSchemeType.Greenscale);
  minColorValue = 0;

  zoom = 1;
  center = new Coordinate(0, 0);
  fractalParams: FractalParams = new MandelbrotSetParams(100, 2);
}
