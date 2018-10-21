import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { filter } from 'rxjs/operators';
import { ProcessFractalInfo } from 'worker/app-workers/messages/process-fractal-info';
import { ProcessFractalResults } from 'worker/app-workers/messages/process-fractal-results';
import { WorkerMessageType } from 'worker/app-workers/messages/worker-message.enum';

import { MandelbrotSetParams } from '../../../worker/app-workers/fractals/mandelbrot-set-params';
import { ComputedPoint } from '../../../worker/app-workers/shared/computed-point';
import { WorkerService } from '../services/worker.service';
import { Coordinate } from '../../../worker/app-workers/shared/coordinate';
import { Point } from 'worker/app-workers/shared/point';
import { Greenscale } from '../color-schemes/greenscale';

@Component({
  selector: 'app-fractal-canvas',
  templateUrl: './fractal-canvas.component.html',
  styleUrls: ['./fractal-canvas.component.scss']
})
export class FractalCanvasComponent implements AfterViewInit {
  @Output() hoverLocationChanged = new EventEmitter<Coordinate>();
  @ViewChild('myCanvas') myCanvas: ElementRef;

  private colorScheme = new Greenscale();
  private dimensions: Point;
  private topLeftCoord: Coordinate;
  private increment: number;
  private context: CanvasRenderingContext2D;
  private imageData: ImageData;

  constructor(
    public cdr: ChangeDetectorRef,
    public workerService: WorkerService) { }

  ngAfterViewInit(): void {
    this.context = (<HTMLCanvasElement>this.myCanvas.nativeElement).getContext('2d');
    this.dimensions = new Point(this.context.canvas.offsetWidth, this.context.canvas.offsetHeight);

    this.myCanvas.nativeElement.width  = this.dimensions.x;
    this.myCanvas.nativeElement.height = this.dimensions.y;

    this.workerService.workerUpdate$.pipe(
      filter(x => x.type === WorkerMessageType.ProcessFractalResults)
    ).subscribe(message => this.setPixelsOnImageData((message as ProcessFractalResults).computedPoints));

    requestAnimationFrame(() => this.paint());

    this.runProcessing(new Coordinate(0, 0), 0.005);
  }

  runProcessing(center: Coordinate, increment: number): void {
    this.imageData = this.context.createImageData(this.dimensions.x, this.dimensions.y);
    this.topLeftCoord = center.computeTopLeftCoordinate(this.dimensions, increment);
    this.increment = increment;

    this.workerService.doWork(new ProcessFractalInfo(
      this.topLeftCoord,
      this.dimensions,
      increment,
      new MandelbrotSetParams(100, 2)
    ));
  }

  pointClicked($event: MouseEvent): void {
    const point = new Point($event.offsetX, $event.offsetY);
    const coord = point.toCoordinate(this.topLeftCoord, this.increment);
    this.runProcessing(coord, this.increment / 2);
  }

  hoverLocation($event: MouseEvent): void {
    const point = new Point($event.offsetX, $event.offsetY);
    const coord = point.toCoordinate(this.topLeftCoord, this.increment);
    this.hoverLocationChanged.emit(coord);
  }

  // Drawing

  private paint(): void {
    this.context.putImageData(this.imageData, 0, 0);
    requestAnimationFrame(() => this.paint());
  }

  private setPixelsOnImageData(computedPoints: ComputedPoint[]) {
    computedPoints.forEach(cp => {
      const colorIndices = this.getColorIndicesForPoint(cp.point, this.dimensions.x);
      const [redIndex, greenIndex, blueIndex, alphaIndex] = colorIndices;

      this.imageData.data[redIndex] = this.colorScheme.getRed(cp.value, 100);
      this.imageData.data[greenIndex] = this.colorScheme.getGreen(cp.value, 100);
      this.imageData.data[blueIndex] = this.colorScheme.getBlue(cp.value, 100);
      this.imageData.data[alphaIndex] = this.colorScheme.getAlpha(cp.value, 100);
    });
  }

  private getColorIndicesForPoint(point: Point, width: number): number[] {
    const red = point.y * (width * 4) + point.x * 4;
    return [red, red + 1, red + 2, red + 3];
  }
}
