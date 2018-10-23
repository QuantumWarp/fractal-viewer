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
import { ProcessFractalCancel } from 'worker/app-workers/messages/process-fractal-cancel';
import { FractalImageLoader } from './fractal-image-loader';

@Component({
  selector: 'app-fractal-canvas',
  templateUrl: './fractal-canvas.component.html',
  styleUrls: ['./fractal-canvas.component.scss']
})
export class FractalCanvasComponent implements AfterViewInit {
  private static count = 1;

  @Output() hoverLocationChanged = new EventEmitter<Coordinate>();
  @ViewChild('myCanvas') myCanvas: ElementRef;

  private context: CanvasRenderingContext2D;
  private fractalImageLoader: FractalImageLoader;

  constructor(
    public cdr: ChangeDetectorRef,
    public fractalSettingsService: FractalSettingsService,
    public workerService: WorkerService) { }

  ngAfterViewInit(): void {
    this.context = (<HTMLCanvasElement>this.myCanvas.nativeElement).getContext('2d');

    this.updateDimensions();

    this.fractalSettingsService.updated.subscribe(() => this.runProcessing());

    requestAnimationFrame(() => this.paint());

    this.runProcessing();
  }

  runProcessing(): void {
    if (this.fractalImageLoader) { this.fractalImageLoader.cancel(); }
    this.fractalImageLoader = new FractalImageLoader(
      FractalCanvasComponent.count++,
      this.fractalSettingsService.center,
      this.fractalSettingsService.increment,
      this.fractalSettingsService.dimensions,
      this.fractalSettingsService.fractalParams,
      this.fractalSettingsService.minColorValue,
      this.fractalSettingsService.colorScheme,
      this.workerService);
  }

  pointClicked($event: MouseEvent): void {
    if (!this.fractalImageLoader) { return; }
    const point = new Point($event.offsetX, $event.offsetY);
    const coord = point.toCoordinate(this.fractalImageLoader.topLeftCoord, this.fractalSettingsService.increment);
    this.fractalSettingsService.center = coord;
    this.fractalSettingsService.zoom = this.fractalSettingsService.zoom * this.fractalSettingsService.zoomFactor;
    this.fractalSettingsService.updated.emit();
  }

  hoverLocation($event: MouseEvent): void {
    if (!this.fractalImageLoader) { return; }
    const point = new Point($event.offsetX, $event.offsetY);
    const coord = point.toCoordinate(this.fractalImageLoader.topLeftCoord, this.fractalSettingsService.increment);
    this.hoverLocationChanged.emit(coord);
  }

  private updateDimensions(): void {
    this.fractalSettingsService.dimensions = new Point(this.context.canvas.offsetWidth, this.context.canvas.offsetHeight);

    this.myCanvas.nativeElement.width  = this.fractalSettingsService.dimensions.x;
    this.myCanvas.nativeElement.height = this.fractalSettingsService.dimensions.y;
  }

  private paint(): void {
    this.context.putImageData(this.fractalImageLoader.imageData, 0, 0);
    requestAnimationFrame(() => this.paint());
  }
}
