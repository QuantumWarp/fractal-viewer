import { BurningShip } from '../burning-ship';
import { MandelbrotSet } from '../mandelbrot-set';
import { FractalParams } from './fractal-params.interface';
import { FractalType } from './fractal-type.enum';

export class FractalFactory {

  static create(params: FractalParams) {

    switch (params.type) {
      case FractalType.MandelbrotSet:
        return new MandelbrotSet(<any>params);
      case FractalType.BurningShip:
        return new BurningShip(<any>params);
    }
  }
}
