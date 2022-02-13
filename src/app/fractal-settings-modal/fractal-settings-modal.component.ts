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
        this.form.value.centerY,
      ),
      {
        type: this.form.value.fractalType,
        maxIterations: this.form.value.maxIterations,
        bound: this.form.value.bound,
      },
    );
    this.dialogRef.close();
  }
}
