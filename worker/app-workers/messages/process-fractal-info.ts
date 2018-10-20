import { FractalParams } from '../fractals/shared/fractal-params.interface';
import { Coordinate } from '../shared/coordinate';
import { WorkerMessageType } from './worker-message.enum';
import { WorkerMessage } from './worker-message.interface';

export class ProcessFractalInfo implements WorkerMessage {
  type = WorkerMessageType.ProcessFractalInfo;

  constructor(
    public center: Coordinate,
    public width: number,
    public height: number,
    public increment: number,
    public fractalParams: FractalParams,
  ) { }
}
