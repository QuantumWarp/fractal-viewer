import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent {
  get thisYear(): number {
    return new Date().getFullYear();
  }

  constructor(private dialogRef: MatDialogRef<AboutComponent>) { }

  close(): void {
    this.dialogRef.close();
  }
}
