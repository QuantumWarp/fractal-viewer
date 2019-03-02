import { EventEmitter, Injectable } from '@angular/core';
import { Coordinate } from 'worker/app-workers/shared/coordinate';

import { MandelbrotSetParams } from '../../../worker/app-workers/fractals/mandelbrot-set-params';
import { FractalParams } from '../../../worker/app-workers/fractals/shared/fractal-params.interface';
import { Point } from '../../../worker/app-workers/shared/point';
import { ColorSchemeFactory } from '../color-schemes/color-scheme-factory';
import { ColorSchemeType } from '../color-schemes/color-scheme-type.enum';
import { ColorScheme } from '../color-schemes/color-scheme.interface';
import { FractalUrlService } from './fractal-url.service';

@Injectable()
export class FractalSettingsService {
  private defaultPixelSize = 0.005;
  updated = new EventEmitter();

  get increment(): number {
    return this.defaultPixelSize / this.zoom;
  }

  dimensions: Point;

  // Settings
  zoomFactor = 2;

  colorScheme = ColorSchemeFactory.create(ColorSchemeType.Greenscale);
  minColorValue = 0;

  zoom = 1;
  center = new Coordinate(0, 0);
  fractalParams: FractalParams = new MandelbrotSetParams(100, 2);

  constructor(private fractalUrlService: FractalUrlService) {
    const previousState = localStorage.getItem('fractalState');

    if (previousState) {
      Object.assign(this, JSON.parse(previousState, this.jsonReviver));
    }

    fractalUrlService.newUrlSettings.subscribe(settingsString => {
      Object.assign(this, JSON.parse(settingsString, this.jsonReviver));
      this.updateStorage();
    });
  }

  setSettings(
    zoomFactor: number,
    colorScheme: ColorScheme,
    minColorValue: number,
    zoom: number,
    center: Coordinate,
    fractalParams: FractalParams,
  ): void {
    this.zoomFactor = zoomFactor;
    this.colorScheme = colorScheme;
    this.minColorValue = minColorValue;
    this.zoom = zoom;
    this.center = center;
    this.fractalParams = fractalParams;
    this.updateStorage();
  }

  resetZoom(): void {
    this.zoom = 1;
    this.center = new Coordinate(0, 0);
    this.updateStorage();
  }

  zoomOnCoord(coord: Coordinate): void {
    this.center = coord;
    this.zoom = this.zoom * this.zoomFactor;
    this.updateStorage();
  }

  resetAll(): void {
    this.zoomFactor = 2;
    this.colorScheme = ColorSchemeFactory.create(ColorSchemeType.Greenscale);
    this.zoom = 1;
    this.center = new Coordinate(0, 0);
    this.fractalParams.maxIterations = 250;
    this.fractalParams.bound = 2;
    this.updateStorage();
  }

  private updateStorage(): void {
    const stringifiedSettings = JSON.stringify(this, this.jsonReplacer);
    localStorage.setItem('fractalState', JSON.stringify(this, this.jsonReplacer));
    this.updated.emit();
    this.fractalUrlService.updateUrl(stringifiedSettings);
  }

  private jsonReviver(key: string, value: any): any {
    if (key === 'center') { return new Coordinate(value.x, value.y); }
    if (key === 'colorScheme') { return ColorSchemeFactory.create(value.type); }
    return value;
  }

  // TODO: settings should be separate model
  private jsonReplacer(key: string, value: any): any {
    if (key === 'fractalUrlService') { return undefined; }
    if (key === 'increment') { return undefined; }
    if (key === 'updated') { return undefined; }
    if (key === 'dimensions') { return undefined; }
    if (key === 'defaultPixelSize') { return undefined; }
    return value;
  }
}
