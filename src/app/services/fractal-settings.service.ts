import { EventEmitter, Injectable } from '@angular/core';
import { Coordinate } from '../../worker/app-workers/shared/coordinate';

import { MandelbrotSetParams } from '../../worker/app-workers/fractals/mandelbrot-set-params';
import { ColorSchemeFactory } from '../color-schemes/color-scheme-factory';
import { ColorSchemeType } from '../color-schemes/color-scheme-type.enum';
import FractalSettings from './fractal-settings';

@Injectable()
export class FractalSettingsService {
  private defaultPixelSize = 0.005;

  updated = new EventEmitter();

  get increment(): number {
    return this.defaultPixelSize / this.settings.zoom;
  }

  settings: FractalSettings = {
    params: new MandelbrotSetParams(100, 2),
    zoom: 2,
    zoomFactor: 2,
    center: new Coordinate(0, 0),
    colorScheme: ColorSchemeFactory.create(ColorSchemeType.Greenscale),
    minColorValue: 0,
  };

  constructor() {
    const previousState = localStorage.getItem('fractalState');
    if (!previousState) return;

    try {
      this.settings = JSON.parse(previousState, this.jsonReviver);
    } catch {
      this.updateStorage();
    }
  }

  setSettings(settings: FractalSettings): void {
    this.settings = settings;
    this.updateStorage();
  }

  resetZoom(): void {
    this.settings.zoom = 1;
    this.settings.center = new Coordinate(0, 0);
    this.updateStorage();
  }

  zoomOnCoord(coord: Coordinate): void {
    this.settings.center = coord;
    this.settings.zoom *= this.settings.zoomFactor;
    this.updateStorage();
  }

  resetAll(): void {
    this.settings.params.maxIterations = 250;
    this.settings.params.bound = 2;
    this.settings.zoom = 1;
    this.settings.zoomFactor = 2;
    this.settings.center = new Coordinate(0, 0);
    this.settings.colorScheme = ColorSchemeFactory.create(ColorSchemeType.Greenscale);
    this.settings.minColorValue = 0;
    this.updateStorage();
  }

  private updateStorage(): void {
    localStorage.setItem('fractalState', JSON.stringify(this.settings));
    this.updated.emit();
  }

  private jsonReviver(key: string, value: any): any {
    if (key === 'center') { return new Coordinate(value.x, value.y); }
    if (key === 'colorScheme') { return ColorSchemeFactory.create(value.type); }
    return value;
  }
}
