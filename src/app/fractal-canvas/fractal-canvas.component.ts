import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

import { ComputedPoint } from '../models/computed-point';
import { Coordinate } from '../models/coordinate';
import { FractalProcessor } from '../models/fractal-processor';
import { MandelbrotSet } from '../models/fractals/mandelbrot-set';

@Component({
  selector: 'app-fractal-canvas',
  templateUrl: './fractal-canvas.component.html',
  styleUrls: ['./fractal-canvas.component.css']
})
export class FractalCanvasComponent implements AfterViewInit {
  @ViewChild('myCanvas') myCanvas: ElementRef;

  private context: CanvasRenderingContext2D;
  private fractalProcessor: FractalProcessor;

  ngAfterViewInit(): void {
    this.context = (<HTMLCanvasElement>this.myCanvas.nativeElement).getContext('2d');

    this.context.canvas.width  = window.innerWidth;
    this.context.canvas.height = window.innerHeight;

    this.fractalProcessor = new FractalProcessor(
      new Coordinate(0, 0),
      this.context.canvas.width,
      this.context.canvas.height,
      0.005,
      new MandelbrotSet(50, 2)
    );
    this.fractalProcessor.computedCoord.subscribe(x => this.drawPixel(x));

    this.fractalProcessor.process();
  }


  private drawPixel(computedPoint: ComputedPoint) {
    if (computedPoint.value === undefined) { return; }

    this.context.fillStyle = 'rgb(0,0,0)'; // sets the color to fill in the rectangle with
    this.context.fillRect(computedPoint.x, computedPoint.y, 1, 1);
  }
}
