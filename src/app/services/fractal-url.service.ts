import { Injectable } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { ActivatedRoute } from '@angular/router';
import { Buffer } from 'buffer';
import { Coordinate } from '../../worker/app-workers/shared/coordinate';
import { ColorSchemeFactory } from '../color-schemes/color-scheme-factory';
import { FractalSettingsService } from './fractal-settings.service';

@Injectable()
export class FractalUrlService {
  constructor(
    private clipboard: Clipboard,
    private activatedRoute: ActivatedRoute,
    private fractalSettingsService: FractalSettingsService,
  ) {
    this.activatedRoute.fragment.subscribe((encoded: string) => {
      if (!encoded) return;

      const settingsString = Buffer.from(encoded, 'base64').toString('ascii');
      const settings = JSON.parse(settingsString, this.jsonReviver);
      fractalSettingsService.setSettings(settings);
      window.history.pushState('', document.title, window.location.pathname + window.location.search);
    });
  }

  copyToClipboard(): void {
    const stringSettings = JSON.stringify(this.fractalSettingsService.settings);
    const encoded = Buffer.from(stringSettings).toString('base64');
    const url = `${window.location.protocol}//${window.location.host}#${encoded}`;
    this.clipboard.copy(url);
  }

  private jsonReviver(key: string, value: any): any {
    if (key === 'center') { return new Coordinate(value.x, value.y); }
    if (key === 'colorScheme') { return ColorSchemeFactory.create(value.type); }
    return value;
  }
}
