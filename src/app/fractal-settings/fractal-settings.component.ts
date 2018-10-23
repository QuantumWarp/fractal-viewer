import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Coordinate } from 'worker/app-workers/shared/coordinate';

import { FractalParams } from '../../../worker/app-workers/fractals/shared/fractal-params.interface';
import { FractalType } from '../../../worker/app-workers/fractals/shared/fractal-type.enum';
import { ColorSchemeFactory } from '../color-schemes/color-scheme-factory';
import { ColorSchemeType } from '../color-schemes/color-scheme-type.enum';
import { FractalImageLoader } from '../fractal-canvas/fractal-image-loader';
import { FractalSettingsService } from '../services/fractal-settings.service';
import { WorkerService } from '../services/worker.service';
import { Point } from '../../../worker/app-workers/shared/point';

@Component({
  selector: 'app-fractal-settings',
  templateUrl: './fractal-settings.component.html',
  styleUrls: ['./fractal-settings.component.scss']
})
export class FractalSettingsComponent implements OnInit {
  fractalTypes = FractalType;
  colorSchemes = ColorSchemeType;

  form: FormGroup;

  constructor(
    private fractalSettingsService: FractalSettingsService,
    private workerService: WorkerService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      fractalType: [, ],
      zoom: [, ],
      zoomFactor: [, ],
      centerX: [, ],
      centerY: [, ],
      bound: [, ],
      maxIterations: [, ],
      colorScheme: [, ],
      minColorValue: [, ],
    });
    this.patchForm();

    this.fractalSettingsService.updated.subscribe(() => this.patchForm());
  }

  patchForm(): void {
    this.form.get('fractalType').setValue(this.fractalSettingsService.fractalParams.type);
    this.form.get('zoomFactor').setValue(this.fractalSettingsService.zoomFactor);
    this.form.get('colorScheme').setValue(this.fractalSettingsService.colorScheme.type);
    this.form.get('zoom').setValue(this.fractalSettingsService.zoom);
    this.form.get('centerX').setValue(this.fractalSettingsService.center.x);
    this.form.get('centerY').setValue(this.fractalSettingsService.center.y);
    this.form.get('maxIterations').setValue(this.fractalSettingsService.fractalParams.maxIterations);
    this.form.get('bound').setValue(this.fractalSettingsService.fractalParams.bound);
    this.form.get('minColorValue').setValue(this.fractalSettingsService.minColorValue);
  }

  applySettings(): void {
    this.fractalSettingsService.zoomFactor = this.form.value.zoomFactor;
    this.fractalSettingsService.colorScheme = ColorSchemeFactory.create(this.form.value.colorScheme);
    this.fractalSettingsService.minColorValue = this.form.value.minColorValue;

    this.fractalSettingsService.zoom = this.form.value.zoom;
    this.fractalSettingsService.center = new Coordinate(
      this.form.value.centerX,
      this.form.value.centerY
    );
    this.fractalSettingsService.fractalParams = <FractalParams> {
      type: this.form.value.fractalType,
      maxIterations: this.form.value.maxIterations,
      bound: this.form.value.bound
    };
    this.fractalSettingsService.updated.emit();
  }

  resetZoom(): void {
    this.fractalSettingsService.zoom = 1;
    this.fractalSettingsService.center = new Coordinate(0, 0);
    this.fractalSettingsService.updated.emit();
  }

  resetAll(): void {
    this.fractalSettingsService.zoomFactor = 2;
    this.fractalSettingsService.colorScheme = ColorSchemeFactory.create(ColorSchemeType.Greenscale);
    this.fractalSettingsService.zoom = 1;
    this.fractalSettingsService.center = new Coordinate(0, 0);
    this.fractalSettingsService.fractalParams.maxIterations = 100;
    this.fractalSettingsService.fractalParams.bound = 2;
    this.fractalSettingsService.updated.emit();
  }

  download(): void {
    const downloader = new FractalImageLoader(
      this.fractalSettingsService.center,
      this.fractalSettingsService.increment,
      new Point(1920, 1080),
      this.fractalSettingsService.fractalParams,
      this.fractalSettingsService.minColorValue,
      this.fractalSettingsService.colorScheme,
      this.workerService);

    downloader.finished$.subscribe(() => {
      const canvas = document.createElement('canvas');
      canvas.width = 1920;
      canvas.height = 1080;

      canvas.getContext('2d').putImageData(downloader.imageData, 0, 0);
      this.saveCanvas(canvas, 'fractaldownload');
    });
  }

  private saveCanvas(canvas: HTMLCanvasElement, fileName: string) {
    const canvasDataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');

    // set parameters for downloading
    link.setAttribute('href', canvasDataUrl);
    link.setAttribute('target', '_blank');
    link.setAttribute('download', fileName);

    link.click();
  }
}
