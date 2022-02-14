import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FractalListService } from '../services/fractal-list.service';
import { FractalSettingsService } from '../services/fractal-settings.service';

@Component({
  templateUrl: './fractal-save.component.html',
  styleUrls: ['./fractal-save.component.scss'],
})
export class FractalSaveComponent {
  form: FormGroup;

  constructor(
    private fractalSettingsService: FractalSettingsService,
    public fractalListService: FractalListService,
    private formBuilder: FormBuilder,
  ) {
    this.form = this.formBuilder.group({ name: '' });
  }

  confirm(): void {
    this.fractalListService.save(
      this.form.value.name,
      this.fractalSettingsService.settings,
    );
  }
}
