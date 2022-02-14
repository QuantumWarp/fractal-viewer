import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
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
import { ClipboardModule } from '@angular/cdk/clipboard';

import { AboutComponent } from './about/about.component';
import { AppComponent } from './app.component';
import { FractalCanvasComponent } from './fractal-canvas/fractal-canvas.component';
import { FractalSettingsModalComponent } from './fractal-settings-modal/fractal-settings-modal.component';
import { FractalViewerComponent } from './fractal-viewer/fractal-viewer.component';
import { FractalSettingsService } from './services/fractal-settings.service';
import { ResolutionModalComponent } from './resolution-modal/resolution-modal.component';
import { FractalUrlService } from './services/fractal-url.service';
import { FractalSettingsBarComponent } from './fractal-settings-bar/fractal-settings-bar.component';
import { FractalListComponent } from './fractal-list-modal/fractal-list.component';
import { FractalSaveComponent } from './fractal-save-modal/fractal-save.component';
import { FractalListService } from './services/fractal-list.service';
import { FractalIconPipe } from './services/fractal.pipe';

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    FractalViewerComponent,
    FractalCanvasComponent,
    FractalListComponent,
    FractalSaveComponent,
    FractalSettingsModalComponent,
    FractalSettingsBarComponent,
    ResolutionModalComponent,
    FractalIconPipe,
  ],
  entryComponents: [
    AboutComponent,
    ResolutionModalComponent,
    FractalListComponent,
    FractalSaveComponent,
    FractalSettingsModalComponent,
  ],
  imports: [
    ClipboardModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([]),

    MatMenuModule,
    MatListModule,
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
    FractalListService,
    FractalUrlService,
    FractalSettingsService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
