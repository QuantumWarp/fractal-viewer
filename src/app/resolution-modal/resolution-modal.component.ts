import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-resolution-modal',
  templateUrl: './resolution-modal.component.html',
  styleUrls: ['./resolution-modal.component.scss']
})
export class ResolutionModalComponent implements OnInit {

  form: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<ResolutionModalComponent>,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      width: [screen.width, ],
      height: [screen.height, ],
    });
  }

  confirm(): void {
    this.dialogRef.close(this.form.value);
  }
}
