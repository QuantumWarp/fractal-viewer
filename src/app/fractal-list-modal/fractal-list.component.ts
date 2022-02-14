import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
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

  load({ settings }): void {
    this.fractalSettingsService.setSettings(settings);
  }

  deleteItem({ id }): void {
    this.fractalListService.delete(id);
  }

  confirm(): void {
    this.dialogRef.close();
  }
}
