import { NgModule } from '@angular/core';
import { MatButtonModule, MatCardModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { FractalCanvasComponent } from './fractal-canvas/fractal-canvas.component';
import { FractalViewerComponent } from './fractal-viewer/fractal-viewer.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkerService } from './services/worker.service';

@NgModule({
  declarations: [
    AppComponent,
    FractalViewerComponent,
    FractalCanvasComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,

    MatButtonModule,
    MatCardModule,
  ],
  providers: [
    WorkerService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
