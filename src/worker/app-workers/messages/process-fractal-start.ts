import { FractalParams } from '../fractals/shared/fractal-params.interface';
import { Coordinate } from '../shared/coordinate';
import { Point } from '../shared/point';
import { WorkerMessageType } from './worker-message.enum';
import { WorkerMessage } from './worker-message.interface';

export class ProcessFractalStart implements WorkerMessage {
  type = WorkerMessageType.ProcessFractalStart;

  constructor(
    public topLeftCoord: Coordinate,
    public dimensions: Point,
    public increment: number,
    public fractalParams: FractalParams,
  ) { }
}
