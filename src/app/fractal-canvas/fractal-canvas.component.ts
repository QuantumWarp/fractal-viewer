import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { filter } from 'rxjs/operators';
import { ProcessFractalInfo } from 'worker/app-workers/messages/process-fractal-info';
import { ProcessFractalResults } from 'worker/app-workers/messages/process-fractal-results';
import { WorkerMessageType } from 'worker/app-workers/messages/worker-message.enum';

import { MandelbrotSetParams } from '../../../worker/app-workers/fractals/mandelbrot-set-params';
import { ComputedPoint } from '../../../worker/app-workers/shared/computed-point';
import { Coordinate } from '../../../worker/app-workers/shared/coordinate';
import { GreenScale } from '../color-schemes/greenscale';
import { WorkerService } from '../services/worker.service';

@Component({
  selector: 'app-fractal-canvas',
  templateUrl: './fractal-canvas.component.html',
  styleUrls: ['./fractal-canvas.component.css']
})
export class FractalCanvasComponent implements AfterViewInit {
  @ViewChild('myCanvas') myCanvas: ElementRef;

  private colorScheme = new GreenScale();
  private context: CanvasRenderingContext2D;
  private imageData: ImageData;

  constructor(
    public cdr: ChangeDetectorRef,
    public workerService: WorkerService) { }

  ngAfterViewInit(): void {
    this.context = (<HTMLCanvasElement>this.myCanvas.nativeElement).getContext('2d');

    this.myCanvas.nativeElement.width  = this.context.canvas.offsetWidth;
    this.myCanvas.nativeElement.height = this.context.canvas.offsetHeight;

    this.imageData = this.context.getImageData(0, 0, this.myCanvas.nativeElement.width, this.myCanvas.nativeElement.height);

    this.workerService.doWork(new ProcessFractalInfo(
      new Coordinate(0, 0),
      this.context.canvas.width,
      this.context.canvas.height,
      0.005,
      new MandelbrotSetParams(100, 2)
    ));

    this.workerService.workerUpdate$.pipe(
      filter(x => x.type === WorkerMessageType.ProcessFractalResults)
    ).subscribe(message => this.setPixelsOnImageData((message as ProcessFractalResults).computedPoints));

    requestAnimationFrame(() => this.paint());
  }

  private paint(): void {
    this.context.putImageData(this.imageData, 0, 0);
    requestAnimationFrame(() => this.paint());
  }

  private setPixelsOnImageData(computedPoints: ComputedPoint[]) {
    computedPoints.forEach(point => {
      const colorIndices = this.getColorIndicesForCoord(point.x, point.y, this.context.canvas.offsetWidth);
      const [redIndex, greenIndex, blueIndex, alphaIndex] = colorIndices;

      this.imageData.data[redIndex] = this.colorScheme.getRed(point.value, 100);
      this.imageData.data[greenIndex] = this.colorScheme.getGreen(point.value, 100);
      this.imageData.data[blueIndex] = this.colorScheme.getBlue(point.value, 100);
      this.imageData.data[alphaIndex] = this.colorScheme.getAlpha(point.value, 100);
    });
  }

  private getColorIndicesForCoord(x, y, width): number[] {
    const red = y * (width * 4) + x * 4;
    return [red, red + 1, red + 2, red + 3];
  }
}
