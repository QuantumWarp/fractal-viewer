import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { Point } from 'worker/app-workers/shared/point';

import { Coordinate } from '../../../worker/app-workers/shared/coordinate';
import { FractalSettingsService } from '../services/fractal-settings.service';
import { FractalImageLoader } from './fractal-image-loader';

@Component({
  selector: 'app-fractal-canvas',
  templateUrl: './fractal-canvas.component.html',
  styleUrls: ['./fractal-canvas.component.scss']
})
export class FractalCanvasComponent implements AfterViewInit {
  @Output() hoverLocationChanged = new EventEmitter<Coordinate>();
  @ViewChild('myCanvas') myCanvas: ElementRef;

  private context: CanvasRenderingContext2D;
  private fractalImageLoader: FractalImageLoader;

  constructor(
    public cdr: ChangeDetectorRef,
    public fractalSettingsService: FractalSettingsService) { }

  ngAfterViewInit(): void {
    this.context = (<HTMLCanvasElement>this.myCanvas.nativeElement).getContext('2d');

    this.updateDimensions();
    requestAnimationFrame(() => this.paint());

    this.fractalSettingsService.updated.subscribe(() => this.runProcessing());
    this.runProcessing();
  }

  runProcessing(): void {
    if (this.fractalImageLoader) { this.fractalImageLoader.cancel(); }
    this.fractalImageLoader = new FractalImageLoader(
      this.fractalSettingsService.center,
      this.fractalSettingsService.increment,
      this.fractalSettingsService.dimensions,
      this.fractalSettingsService.fractalParams,
      this.fractalSettingsService.minColorValue,
      this.fractalSettingsService.colorScheme);
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
