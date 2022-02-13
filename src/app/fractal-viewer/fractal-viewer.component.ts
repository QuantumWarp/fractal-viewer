import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AboutComponent } from '../about/about.component';

@Component({
  selector: 'app-fractal-viewer',
  templateUrl: './fractal-viewer.component.html',
  styleUrls: ['./fractal-viewer.component.scss']
})
export class FractalViewerComponent {

  constructor(private dialog: MatDialog) { }

  openAbout(): void {
    this.dialog.open(AboutComponent);
  }
}
