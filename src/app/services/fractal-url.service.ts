import { Injectable, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Injectable()
export class FractalUrlService {
  private static settingsUrlKey = 'settings';
  private urlSettings: string;

  newUrlSettings = new EventEmitter<string>();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      if (!params[FractalUrlService.settingsUrlKey]) { return; }
      if (this.urlSettings === params[FractalUrlService.settingsUrlKey]) { return; }

      this.urlSettings = atob(params[FractalUrlService.settingsUrlKey]);
      this.newUrlSettings.emit(this.urlSettings);
    });
  }

  updateUrl(settingsString: string): void {
    const queryParams: Params = {};
    this.urlSettings = settingsString;
    queryParams[FractalUrlService.settingsUrlKey] = btoa(settingsString);

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: queryParams,
      queryParamsHandling: 'merge',
    });
  }
}
