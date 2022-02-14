import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { Coordinate } from '../../worker/app-workers/shared/coordinate';
import { ColorSchemeFactory } from '../color-schemes/color-scheme-factory';
import FractalSettings from './fractal-settings';

@Injectable()
export class FractalListService {
  items: { id: string, name: string, settings: FractalSettings }[] = [];

  constructor() {
    const listString = localStorage.getItem('fractals') || '[]';
    this.items = JSON.parse(listString, this.jsonReviver);
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
}
