import { AfterViewInit, Component, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { filter } from 'rxjs/operators';
import { ProcessFractalInfo } from 'worker/app-workers/messages/process-fractal-info';
import { ProcessFractalResults } from 'worker/app-workers/messages/process-fractal-results';
import { WorkerMessageType } from 'worker/app-workers/messages/worker-message.enum';

import { MandelbrotSetParams } from '../../../worker/app-workers/fractals/mandelbrot-set-params';
import { ComputedPoint } from '../../../worker/app-workers/shared/computed-point';
import { Coordinate } from '../../../worker/app-workers/shared/coordinate';
import { WorkerService } from '../services/worker.service';

@Component({
  selector: 'app-fractal-canvas',
  templateUrl: './fractal-canvas.component.html',
  styleUrls: ['./fractal-canvas.component.css']
})
export class FractalCanvasComponent implements AfterViewInit {
  @ViewChild('myCanvas') myCanvas: ElementRef;

  private context: CanvasRenderingContext2D;

  constructor(
    public cdr: ChangeDetectorRef,
    public workerService: WorkerService) { }

  ngAfterViewInit(): void {
    this.context = (<HTMLCanvasElement>this.myCanvas.nativeElement).getContext('2d');

    this.myCanvas.nativeElement.width  = this.context.canvas.offsetWidth;
    this.myCanvas.nativeElement.height = this.context.canvas.offsetHeight;

    this.workerService.doWork(new ProcessFractalInfo(
      new Coordinate(0, 0),
      this.context.canvas.width,
      this.context.canvas.height,
      0.005,
      new MandelbrotSetParams(50, 2)
    ));

    this.workerService.workerUpdate$.subscribe(x => console.log(x));
    this.workerService.workerUpdate$.pipe(
      filter(x => x.type === WorkerMessageType.ProcessFractalResults)
    ).subscribe(message => this.drawPixels((message as ProcessFractalResults).computedPoints));
  }


  private drawPixels(computedPoints: ComputedPoint[]) {
    computedPoints.forEach(point => {
      if (point.value === undefined) { return; }

      this.context.fillStyle = 'rgb(0,0,0)'; // sets the color to fill in the rectangle with
      this.context.drawImage.fillRect(point.x, point.y, 1, 1);
    });
  }
}
