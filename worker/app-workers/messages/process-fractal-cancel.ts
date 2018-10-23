import { WorkerMessageType } from './worker-message.enum';
import { WorkerMessage } from './worker-message.interface';

export class ProcessFractalCancel implements WorkerMessage {
  type = WorkerMessageType.ProcessFractalCancel;

  constructor(public processId: number) { }
}
