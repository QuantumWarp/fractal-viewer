import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCardModule, MatToolbarModule, MatSelectModule, MatFormFieldModule, MatInputModule, MatTooltipModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { FractalCanvasComponent } from './fractal-canvas/fractal-canvas.component';
import { FractalSettingsComponent } from './fractal-settings/fractal-settings.component';
import { FractalViewerComponent } from './fractal-viewer/fractal-viewer.component';
import { FractalSettingsService } from './services/fractal-settings.service';
import { KeysPipe } from './services/keys.pipe';
import { WorkerService } from './services/worker.service';

@NgModule({
  declarations: [
    AppComponent,
    FractalViewerComponent,
    FractalCanvasComponent,
    FractalSettingsComponent,
    KeysPipe,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,

    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
  ],
  providers: [
    FractalSettingsService,
    WorkerService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
