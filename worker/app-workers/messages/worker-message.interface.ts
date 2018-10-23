import { WorkerMessageType } from './worker-message.enum';

export interface WorkerMessage {
  type: WorkerMessageType;
  processId: number;
}
