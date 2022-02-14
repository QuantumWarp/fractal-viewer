import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { BurningShipParams } from '../../worker/app-workers/fractals/burning-ship-params';
import { MandelbrotSetParams } from '../../worker/app-workers/fractals/mandelbrot-set-params';
import { Coordinate } from '../../worker/app-workers/shared/coordinate';
import { ColorSchemeFactory } from '../color-schemes/color-scheme-factory';
import { Greenscale } from '../color-schemes/schemes/greenscale';
import FractalSettings from './fractal-settings';

@Injectable()
export class FractalListService {
  items: {
    id: string,
    name: string,
    settings: FractalSettings,
  }[] = [];

  constructor() {
    this.load();
  }

  save(name: string, settings: FractalSettings): void {
    this.items.push({ id: uuidv4(), name, settings });
    localStorage.setItem('fractals', JSON.stringify(this.items));
  }

  delete(id: string): void {
    this.items = this.items.filter((x) => x.id !== id);
    localStorage.setItem('fractals', JSON.stringify(this.items));
  }

  private jsonReviver(key: string, value: any): any {
    if (key === 'center') { return new Coordinate(value.x, value.y); }
    if (key === 'colorScheme') { return ColorSchemeFactory.create(value.type); }
    return value;
  }

  private load(): string {
    const listString = localStorage.getItem('fractals');
    if (!listString) {
      this.setDefaults();
    } else {
      try {
        this.items = JSON.parse(listString, this.jsonReviver);
        return;
      } catch {
        this.setDefaults();
      }
    }
  }

  private setDefaults(): void {
    this.items = [{
      id: '1',
      name: 'The Ship',
      settings: {
        params: new BurningShipParams(100, 2),
        zoom: 32,
        zoomFactor: 2,
        center: new Coordinate(-1.7546875, -0.02703125),
        colorScheme: new Greenscale(),
        minColorValue: 0,
      },
    },
    {
      id: '2',
      name: 'Self Similar',
      settings: {
        params: new MandelbrotSetParams(150, 2),
        zoom: 128,
        zoomFactor: 2,
        center: new Coordinate(-0.128125, -0.987734375),
        colorScheme: new Greenscale(),
        minColorValue: 10,
      },
    }];
    localStorage.setItem('fractals', JSON.stringify(this.items));
  }
}
