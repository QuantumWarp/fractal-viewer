import { WorkerMessageType } from './worker-message.enum';
import { WorkerMessage } from './worker-message.interface';
import { ComputedPoint } from '../shared/computed-point';

export class ProcessFractalResults implements WorkerMessage {
  type = WorkerMessageType.ProcessFractalResults;

  constructor(
    public processId: number,
    public computedPoints: ComputedPoint[]) { }
}
