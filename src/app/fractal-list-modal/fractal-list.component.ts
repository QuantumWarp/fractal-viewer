import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Coordinate } from '../../worker/app-workers/shared/coordinate';
import { ColorSchemeFactory } from '../color-schemes/color-scheme-factory';
import { FractalListService } from '../services/fractal-list.service';
import FractalSettings from '../services/fractal-settings';
import { FractalSettingsService } from '../services/fractal-settings.service';

@Component({
  templateUrl: './fractal-list.component.html',
  styleUrls: ['./fractal-list.component.scss'],
})
export class FractalListComponent {
  get orderedItems(): { id: string, name: string, settings: FractalSettings }[] {
    return [...this.fractalListService.items]
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  constructor(
    private dialogRef: MatDialogRef<FractalListComponent>,
    private fractalSettingsService: FractalSettingsService,
    public fractalListService: FractalListService,
  ) { }

  load({ settings }: { settings: FractalSettings }): void {
    const settingsClone: FractalSettings = {
      ...settings,
      params: { ...settings.params },
      colorScheme: ColorSchemeFactory.create(settings.colorScheme.type),
      center: new Coordinate(settings.center.x, settings.center.y),
    };

    this.fractalSettingsService.setSettings(settingsClone);
  }

  deleteItem({ id }): void {
    this.fractalListService.delete(id);
  }

  confirm(): void {
    this.dialogRef.close();
  }
}
