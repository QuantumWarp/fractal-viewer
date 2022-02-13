import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Coordinate } from '../../worker/app-workers/shared/coordinate';
import { FractalType } from '../../worker/app-workers/fractals/shared/fractal-type.enum';
import { ColorSchemeFactory } from '../color-schemes/color-scheme-factory';
import { ColorSchemeType } from '../color-schemes/color-scheme-type.enum';
import { FractalSettingsService } from '../services/fractal-settings.service';

@Component({
  selector: 'app-fractal-settings-modal',
  templateUrl: './fractal-settings-modal.component.html',
  styleUrls: ['./fractal-settings-modal.component.scss'],
})
export class FractalSettingsModalComponent implements OnInit {
  fractalTypes = FractalType;

  colorSchemes = ColorSchemeType;

  downloading = false;

  form: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<FractalSettingsModalComponent>,
    public fractalSettingsService: FractalSettingsService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      fractalType: [],
      zoom: [],
      zoomFactor: [],
      centerX: [],
      centerY: [],
      bound: [],
      maxIterations: [],
      colorScheme: [],
      minColorValue: [],
    });
    this.patchForm();

    this.fractalSettingsService.updated.subscribe(() => this.patchForm());
  }

  patchForm(): void {
    this.form.get('fractalType').setValue(this.fractalSettingsService.settings.params.type);
    this.form.get('maxIterations').setValue(this.fractalSettingsService.settings.params.maxIterations);
    this.form.get('bound').setValue(this.fractalSettingsService.settings.params.bound);
    this.form.get('zoom').setValue(this.fractalSettingsService.settings.zoom);
    this.form.get('zoomFactor').setValue(this.fractalSettingsService.settings.zoomFactor);
    this.form.get('centerX').setValue(this.fractalSettingsService.settings.center.x);
    this.form.get('centerY').setValue(this.fractalSettingsService.settings.center.y);
    this.form.get('colorScheme').setValue(this.fractalSettingsService.settings.colorScheme.type);
    this.form.get('minColorValue').setValue(this.fractalSettingsService.settings.minColorValue);
  }

  applySettings(): void {
    this.fractalSettingsService.setSettings({
      params: {
        type: this.form.value.fractalType,
        maxIterations: this.form.value.maxIterations,
        bound: this.form.value.bound,
      },
      zoom: this.form.value.zoom,
      zoomFactor: this.form.value.zoomFactor,
      center: new Coordinate(
        this.form.value.centerX,
        this.form.value.centerY,
      ),
      colorScheme: ColorSchemeFactory.create(this.form.value.colorScheme),
      minColorValue: this.form.value.minColorValue,
    });
    this.dialogRef.close();
  }
}
