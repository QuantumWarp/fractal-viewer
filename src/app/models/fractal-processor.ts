import { EventEmitter } from '@angular/core';

import { ComputedPoint } from './computed-point';
import { Coordinate } from './coordinate';
import { Fractal } from './fractals/fractal.interface';

export class FractalProcessor {
  public computedCoord = new EventEmitter<ComputedPoint>();

  private topLeftCoord: Coordinate;

  constructor(
    center: Coordinate,
    private width: number,
    private height: number,
    private increment: number,
    private fractal: Fractal,
  ) {
    this.topLeftCoord = new Coordinate(
      center.x - (increment * width / 2),
      center.y - (increment * height / 2)
    );
  }

  process(): void {
    let x = 0;

    while (x < this.width) {
      let y = 0;

      while (y < this.height) {
        const coord = this.translateToCoord(x, y);
        const iterations = this.fractal.calculate(coord);
        this.computedCoord.emit(new ComputedPoint(x, y, iterations));
        y++;
      }

      x++;
    }
  }

  private translateToCoord(x: number, y: number): Coordinate {
    return new Coordinate(
      this.topLeftCoord.x + (this.increment * x),
      this.topLeftCoord.y + (this.increment * y),
    );
  }
}
