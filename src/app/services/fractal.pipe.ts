import { PipeTransform, Pipe } from '@angular/core';
import { FractalType } from '../../worker/app-workers/fractals/shared/fractal-type.enum';

@Pipe({ name: 'fractalIcon' })
export class FractalIconPipe implements PipeTransform {
  transform(type: FractalType): any {
    switch (type) {
      case FractalType.MandelbrotSet: return 'assets/mandelbrot-set.png';
      case FractalType.BurningShip: return 'assets/burning-ship.png';
      default: throw new Error('Invalid fractal type');
    }
  }
}
