import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  MatToolbarModule,
  MatTooltipModule,
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AboutComponent } from './about/about.component';
import { AppComponent } from './app.component';
import { FractalCanvasComponent } from './fractal-canvas/fractal-canvas.component';
import { FractalSettingsComponent } from './fractal-settings/fractal-settings.component';
import { FractalViewerComponent } from './fractal-viewer/fractal-viewer.component';
import { FractalSettingsService } from './services/fractal-settings.service';
import { KeysPipe } from './services/keys.pipe';

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    FractalViewerComponent,
    FractalCanvasComponent,
    FractalSettingsComponent,
    KeysPipe,
  ],
  entryComponents: [
    AboutComponent,
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
    MatDialogModule,
    MatIconModule,
  ],
  providers: [
    FractalSettingsService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
