import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Coordinate } from 'worker/app-workers/shared/coordinate';

import { FractalParams } from '../../../worker/app-workers/fractals/shared/fractal-params.interface';
import { FractalType } from '../../../worker/app-workers/fractals/shared/fractal-type.enum';
import { Point } from '../../../worker/app-workers/shared/point';
import { ColorSchemeFactory } from '../color-schemes/color-scheme-factory';
import { ColorSchemeType } from '../color-schemes/color-scheme-type.enum';
import { FractalImageLoader } from '../fractal-canvas/fractal-image-loader';
import { FractalSettingsService } from '../services/fractal-settings.service';
import { MatDialog } from '@angular/material';
import { ResolutionModalComponent } from '../resolution-modal/resolution-modal.component';

@Component({
  selector: 'app-fractal-settings',
  templateUrl: './fractal-settings.component.html',
  styleUrls: ['./fractal-settings.component.scss']
})
export class FractalSettingsComponent implements OnInit {
  fractalTypes = FractalType;
  colorSchemes = ColorSchemeType;

  downloading = false;
  form: FormGroup;

  constructor(
    public fractalSettingsService: FractalSettingsService,
    private dialog: MatDialog,
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
    this.fractalSettingsService.setSettings(
      this.form.value.zoomFactor,
      ColorSchemeFactory.create(this.form.value.colorScheme),
      this.form.value.minColorValue,
      this.form.value.zoom,
      new Coordinate(
        this.form.value.centerX,
        this.form.value.centerY
      ),
      {
        type: this.form.value.fractalType,
        maxIterations: this.form.value.maxIterations,
        bound: this.form.value.bound
      },
    );
  }

  download(): void {
    this.dialog.open(ResolutionModalComponent).afterClosed().subscribe(dimensions => {
      if (!dimensions) { return; }
      this.downloadWithDimensions(dimensions.width, dimensions.height);
    });
  }

  private downloadWithDimensions(width: number, height: number) {
    this.downloading = true;

    const downloader = new FractalImageLoader(
      this.fractalSettingsService.center,
      this.fractalSettingsService.increment,
      new Point(width, height),
      this.fractalSettingsService.fractalParams,
      this.fractalSettingsService.minColorValue,
      this.fractalSettingsService.colorScheme);

    downloader.worker.doneUpdate$.subscribe(() => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      canvas.getContext('2d').putImageData(downloader.imageData, 0, 0);
      canvas.toBlob(blob => this.saveBlob(blob, 'fractal'));
    });
  }

  private saveBlob(blob: Blob, fileName: string) {
    const canvasDataUrl = URL.createObjectURL(blob);

    const link = document.createElement('a');

    // set parameters for downloading
    link.setAttribute('href', canvasDataUrl);
    link.setAttribute('target', '_blank');
    link.setAttribute('download', fileName);

    link.click();

    this.downloading = false;
  }
}
