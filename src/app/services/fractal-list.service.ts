import { Injectable } from '@angular/core';
import { Coordinate } from '../../worker/app-workers/shared/coordinate';
import { ColorSchemeFactory } from '../color-schemes/color-scheme-factory';

@Injectable()
export class FractalListService {
  items = [];

  constructor(
    
  ) {
    const listString = localStorage.getItem('fractals') || '[]';
    this.items = JSON.parse(listString, this.jsonReviver);
  }

  save(name: string): void {

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
