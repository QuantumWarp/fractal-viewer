import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { debounceTime, Subject } from 'rxjs';

import { Point } from '../../worker/app-workers/shared/point';
import { Coordinate } from '../../worker/app-workers/shared/coordinate';
import { FractalSettingsService } from '../services/fractal-settings.service';
import { FractalImageLoader } from './fractal-image-loader';

@Component({
  selector: 'app-fractal-canvas',
  templateUrl: './fractal-canvas.component.html',
  styleUrls: ['./fractal-canvas.component.scss'],
})
export class FractalCanvasComponent implements AfterViewInit, OnDestroy {
  @Output() hoverLocationChanged = new EventEmitter<Coordinate>();

  @ViewChild('myCanvas', { static: false }) myCanvas: ElementRef;

  resize$ = new Subject();

  private context: CanvasRenderingContext2D;

  private fractalImageLoader: FractalImageLoader;

  constructor(
    public cdr: ChangeDetectorRef,
    public fractalSettingsService: FractalSettingsService,
  ) { }

  ngAfterViewInit(): void {
    this.context = (<HTMLCanvasElement> this.myCanvas.nativeElement).getContext('2d');

    // Redraw on resize
    this.resize$
      .pipe(debounceTime(500))
      .subscribe(() => this.runProcessing());

    requestAnimationFrame(() => this.paint());

    this.fractalSettingsService.updated.subscribe(() => this.runProcessing());
    this.runProcessing();
  }

  ngOnDestroy(): void {
    this.resize$.complete();
  }

  runProcessing(): void {
    if (this.fractalImageLoader) { this.fractalImageLoader.cancel(); }

    const rect = this.myCanvas.nativeElement.parentNode.getBoundingClientRect();

    this.myCanvas.nativeElement.width = rect.width;
    this.myCanvas.nativeElement.height = rect.height;

    this.fractalSettingsService.dimensions = new Point(rect.width, rect.height);

    this.fractalImageLoader = new FractalImageLoader(
      this.fractalSettingsService.center,
      this.fractalSettingsService.increment,
      this.fractalSettingsService.dimensions,
      this.fractalSettingsService.fractalParams,
      this.fractalSettingsService.minColorValue,
      this.fractalSettingsService.colorScheme,
    );
  }

  pointClicked($event: MouseEvent): void {
    if (!this.fractalImageLoader) { return; }
    const point = new Point($event.offsetX, $event.offsetY);
    const coord = Coordinate.fromPoint(
      point,
      this.fractalImageLoader.topLeftCoord,
      this.fractalSettingsService.increment,
    );
    this.fractalSettingsService.zoomOnCoord(coord);
  }

  hoverLocation($event: MouseEvent): void {
    if (!this.fractalImageLoader) { return; }
    const point = new Point($event.offsetX, $event.offsetY);
    const coord = Coordinate.fromPoint(
      point,
      this.fractalImageLoader.topLeftCoord,
      this.fractalSettingsService.increment,
    );
    this.hoverLocationChanged.emit(coord);
  }

  private paint(): void {
    if (this.fractalImageLoader) {
      this.context.putImageData(this.fractalImageLoader.imageData, 0, 0);
    }
    requestAnimationFrame(() => this.paint());
  }
}
