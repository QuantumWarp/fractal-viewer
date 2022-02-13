import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FractalListService } from '../services/fractal-list.service';

@Component({
  templateUrl: './fractal-list.component.html',
  styleUrls: ['./fractal-list.component.scss'],
})
export class FractalListComponent {
  constructor(
    private dialogRef: MatDialogRef<FractalListComponent>,
    public fractalListService: FractalListService,
  ) { }

  confirm(): void {
    this.dialogRef.close();
  }
}
