import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FractalType } from '../../worker/app-workers/fractals/shared/fractal-type.enum';
import { Point } from '../../worker/app-workers/shared/point';
import { ColorSchemeType } from '../color-schemes/color-scheme-type.enum';
import { FractalImageLoader } from '../fractal-canvas/fractal-image-loader';
import { ResolutionModalComponent } from '../resolution-modal/resolution-modal.component';
import { FractalSettingsService } from '../services/fractal-settings.service';
import { FractalSettingsModalComponent } from '../fractal-settings-modal/fractal-settings-modal.component';

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

  settings(): void {
    this.dialog.open(FractalSettingsModalComponent).afterClosed();
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
      this.fractalSettingsService.center,
      this.fractalSettingsService.increment,
      new Point(width, height),
      this.fractalSettingsService.fractalParams,
      this.fractalSettingsService.minColorValue,
      this.fractalSettingsService.colorScheme,
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
