import { FractalParams } from '../../worker/app-workers/fractals/shared/fractal-params.interface';
import { ProcessFractalStart } from '../../worker/app-workers/messages/process-fractal-start';
import { ComputedPoint } from '../../worker/app-workers/shared/computed-point';
import { Coordinate } from '../../worker/app-workers/shared/coordinate';
import { Point } from '../../worker/app-workers/shared/point';
import { ColorScheme } from '../color-schemes/color-scheme.interface';
import { FractalWorker } from '../services/fractal-worker';

export class FractalImageLoader {
  worker: FractalWorker;

  topLeftCoord: Coordinate;

  imageData: ImageData;

  constructor(
    center: Coordinate,
    increment: number,
    public dimensions: Point,
    private fractalParams: FractalParams,
    private minColorValue: number,
    private colorScheme: ColorScheme,
  ) {
    this.imageData = new ImageData(dimensions.x, dimensions.y);

    this.topLeftCoord = center.computeTopLeftCoordinate(
      dimensions,
      increment,
    );

    this.worker = new FractalWorker();

    this.worker.resultsUpdate$.subscribe(
      (message) => this.setPixelsOnImageData(message.computedPoints),
    );

    this.worker.start(new ProcessFractalStart(
      this.topLeftCoord,
      dimensions,
      increment,
      fractalParams,
    ));
  }

  cancel(): void {
    this.worker.stop();
  }

  private setPixelsOnImageData(computedPoints: ComputedPoint[]) {
    const adjustedMaxIterations = this.fractalParams.maxIterations - this.minColorValue;

    computedPoints.forEach((cp) => {
      const colorIndices = this.getColorIndicesForPoint(cp.point, this.dimensions.x);
      const [redIndex, greenIndex, blueIndex, alphaIndex] = colorIndices;

      const adjustedValue = cp.value < this.minColorValue
        ? 0
        : cp.value - this.minColorValue;

      this.imageData.data[redIndex] = this.colorScheme
        .getRed(adjustedValue, adjustedMaxIterations);
      this.imageData.data[greenIndex] = this.colorScheme
        .getGreen(adjustedValue, adjustedMaxIterations);
      this.imageData.data[blueIndex] = this.colorScheme
        .getBlue(adjustedValue, adjustedMaxIterations);
      this.imageData.data[alphaIndex] = this.colorScheme
        .getAlpha(adjustedValue, adjustedMaxIterations);
    });
  }

  private getColorIndicesForPoint(point: Point, width: number): number[] {
    const red = point.y * (width * 4) + point.x * 4;
    return [red, red + 1, red + 2, red + 3];
  }
}
