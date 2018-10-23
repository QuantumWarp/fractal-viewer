import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {

  constructor(private dialogRef: MatDialogRef<AboutComponent>) { }

  close(): void {
    this.dialogRef.close();
  }
}
