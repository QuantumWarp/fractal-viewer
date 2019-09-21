import { WorkerMessageType } from './worker-message.enum';
import { WorkerMessage } from './worker-message.interface';

export class ProcessFractalDone implements WorkerMessage {
  type = WorkerMessageType.ProcessFractalDone;
}
