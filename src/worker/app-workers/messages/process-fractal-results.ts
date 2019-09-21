import { ComputedPoint } from '../shared/computed-point';
import { WorkerMessageType } from './worker-message.enum';
import { WorkerMessage } from './worker-message.interface';

export class ProcessFractalResults implements WorkerMessage {
  type = WorkerMessageType.ProcessFractalResults;

  constructor(public computedPoints: ComputedPoint[]) { }
}
