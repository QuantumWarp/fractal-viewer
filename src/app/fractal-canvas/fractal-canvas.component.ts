import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { filter } from 'rxjs/operators';
import { ProcessFractalStart } from 'worker/app-workers/messages/process-fractal-start';
import { ProcessFractalResults } from 'worker/app-workers/messages/process-fractal-results';
import { WorkerMessageType } from 'worker/app-workers/messages/worker-message.enum';

import { MandelbrotSetParams } from '../../../worker/app-workers/fractals/mandelbrot-set-params';
import { ComputedPoint } from '../../../worker/app-workers/shared/computed-point';
import { WorkerService } from '../services/worker.service';
import { Coordinate } from '../../../worker/app-workers/shared/coordinate';
import { Point } from 'worker/app-workers/shared/point';
import { Greenscale } from '../color-schemes/schemes/greenscale';
import { FractalSettingsService } from '../services/fractal-settings.service';

@Component({
  selector: 'app-fractal-canvas',
  templateUrl: './fractal-canvas.component.html',
  styleUrls: ['./fractal-canvas.component.scss']
})
export class FractalCanvasComponent implements AfterViewInit {
  private static count = 1;

  @Output() hoverLocationChanged = new EventEmitter<Coordinate>();
  @ViewChild('myCanvas') myCanvas: ElementRef;

  private topLeftCoord: Coordinate;

  private currentProcess: number;
  private context: CanvasRenderingContext2D;
  private imageData: ImageData;

  constructor(
    public cdr: ChangeDetectorRef,
    public fractalSettingsService: FractalSettingsService,
    public workerService: WorkerService) { }

  ngAfterViewInit(): void {
    this.context = (<HTMLCanvasElement>this.myCanvas.nativeElement).getContext('2d');

    this.updateDimensions();

    this.workerService.workerUpdate$.pipe(
      filter(x => x.type === WorkerMessageType.ProcessFractalResults && this.currentProcess === x.processId)
    ).subscribe(message => this.setPixelsOnImageData((message as ProcessFractalResults).computedPoints));

    this.fractalSettingsService.updated.subscribe(() => this.runProcessing());

    requestAnimationFrame(() => this.paint());

    this.runProcessing();
  }

  runProcessing(): void {
    this.imageData = this.context.createImageData(this.fractalSettingsService.dimensions.x, this.fractalSettingsService.dimensions.y);
    this.topLeftCoord = this.fractalSettingsService.center.computeTopLeftCoordinate(
      this.fractalSettingsService.dimensions,
      this.fractalSettingsService.increment
    );

    this.currentProcess = FractalCanvasComponent.count++;
    this.workerService.doWork(new ProcessFractalStart(
      this.currentProcess,
      this.topLeftCoord,
      this.fractalSettingsService.dimensions,
      this.fractalSettingsService.increment,
      this.fractalSettingsService.fractalParams
    ));
  }

  pointClicked($event: MouseEvent): void {
    const point = new Point($event.offsetX, $event.offsetY);
    const coord = point.toCoordinate(this.topLeftCoord, this.fractalSettingsService.increment);
    this.fractalSettingsService.center = coord;
    this.fractalSettingsService.zoom = this.fractalSettingsService.zoom * this.fractalSettingsService.zoomFactor;
    this.fractalSettingsService.updated.emit();
  }

  hoverLocation($event: MouseEvent): void {
    const point = new Point($event.offsetX, $event.offsetY);
    const coord = point.toCoordinate(this.topLeftCoord, this.fractalSettingsService.increment);
    this.hoverLocationChanged.emit(coord);
  }

  private updateDimensions(): void {
    this.fractalSettingsService.dimensions = new Point(this.context.canvas.offsetWidth, this.context.canvas.offsetHeight);

    this.myCanvas.nativeElement.width  = this.fractalSettingsService.dimensions.x;
    this.myCanvas.nativeElement.height = this.fractalSettingsService.dimensions.y;
  }

  // Drawing

  private paint(): void {
    this.context.putImageData(this.imageData, 0, 0);
    requestAnimationFrame(() => this.paint());
  }

  private setPixelsOnImageData(computedPoints: ComputedPoint[]) {
    const adjustedMaxIterations = this.fractalSettingsService.fractalParams.maxIterations - this.fractalSettingsService.minColorValue;

    computedPoints.forEach(cp => {
      const colorIndices = this.getColorIndicesForPoint(cp.point, this.fractalSettingsService.dimensions.x);
      const [redIndex, greenIndex, blueIndex, alphaIndex] = colorIndices;

      const adjustedValue = cp.value < this.fractalSettingsService.minColorValue ?
        0 : cp.value - this.fractalSettingsService.minColorValue;

      this.imageData.data[redIndex] = this.fractalSettingsService.colorScheme.getRed(adjustedValue, adjustedMaxIterations);
      this.imageData.data[greenIndex] = this.fractalSettingsService.colorScheme.getGreen(adjustedValue, adjustedMaxIterations);
      this.imageData.data[blueIndex] = this.fractalSettingsService.colorScheme.getBlue(adjustedValue, adjustedMaxIterations);
      this.imageData.data[alphaIndex] = this.fractalSettingsService.colorScheme.getAlpha(adjustedValue, adjustedMaxIterations);
    });
  }

  private getColorIndicesForPoint(point: Point, width: number): number[] {
    const red = point.y * (width * 4) + point.x * 4;
    return [red, red + 1, red + 2, red + 3];
  }
}
