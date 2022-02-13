import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AboutComponent } from './about/about.component';
import { AppComponent } from './app.component';
import { FractalCanvasComponent } from './fractal-canvas/fractal-canvas.component';
import { FractalSettingsComponent } from './fractal-settings/fractal-settings.component';
import { FractalViewerComponent } from './fractal-viewer/fractal-viewer.component';
import { FractalSettingsService } from './services/fractal-settings.service';
import { KeysPipe } from './services/keys.pipe';
import { ResolutionModalComponent } from './resolution-modal/resolution-modal.component';
import { FractalUrlService } from './services/fractal-url.service';

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    FractalViewerComponent,
    FractalCanvasComponent,
    FractalSettingsComponent,
    ResolutionModalComponent,
    KeysPipe,
  ],
  entryComponents: [
    AboutComponent,
    ResolutionModalComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([]),

    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatDialogModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  providers: [
    FractalUrlService,
    FractalSettingsService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
