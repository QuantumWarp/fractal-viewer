import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FractalType } from '../../worker/app-workers/fractals/shared/fractal-type.enum';
import { Point } from '../../worker/app-workers/shared/point';
import { ColorSchemeType } from '../color-schemes/color-scheme-type.enum';
import { FractalImageLoader } from '../fractal-canvas/fractal-image-loader';
import { ResolutionModalComponent } from '../resolution-modal/resolution-modal.component';
import { FractalSettingsService } from '../services/fractal-settings.service';
import { FractalSettingsModalComponent } from '../fractal-settings-modal/fractal-settings-modal.component';
import { FractalListComponent } from '../fractal-list-modal/fractal-list.component';
import { FractalSaveComponent } from '../fractal-save-modal/fractal-save.component';

@Component({
  selector: 'app-fractal-settings-bar',
  templateUrl: './fractal-settings-bar.component.html',
  styleUrls: ['./fractal-settings-bar.component.scss'],
})
export class FractalSettingsBarComponent {
  fractalTypes = FractalType;

  colorSchemes = ColorSchemeType;

  downloading = false;

  constructor(
    public fractalSettingsService: FractalSettingsService,
    private dialog: MatDialog,
  ) { }

  list(): void {
    this.dialog.open(FractalListComponent, {
      position: { left: '20px' },
    });
  }

  save(): void {
    this.dialog.open(FractalSaveComponent);
  }

  settings(): void {
    this.dialog.open(FractalSettingsModalComponent);
  }

  download(): void {
    this.dialog.open(ResolutionModalComponent).afterClosed().subscribe((dimensions) => {
      if (!dimensions) { return; }
      this.downloadWithDimensions(dimensions.width, dimensions.height);
    });
  }

  private downloadWithDimensions(width: number, height: number) {
    this.downloading = true;

    const downloader = new FractalImageLoader(
      this.fractalSettingsService.settings.center,
      this.fractalSettingsService.increment,
      new Point(width, height),
      this.fractalSettingsService.settings.params,
      this.fractalSettingsService.settings.minColorValue,
      this.fractalSettingsService.settings.colorScheme,
    );

    downloader.worker.doneUpdate$.subscribe(() => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      canvas.getContext('2d').putImageData(downloader.imageData, 0, 0);
      canvas.toBlob((blob) => this.saveBlob(blob, 'fractal'));
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
