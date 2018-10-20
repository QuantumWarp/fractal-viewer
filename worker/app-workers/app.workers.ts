import { FractalProcessor } from './fractal-processers/fractal-processor';
import { ProcessFractalDone } from './messages/process-fractal-done';
import { ProcessFractalInfo } from './messages/process-fractal-info';
import { ProcessFractalResults } from './messages/process-fractal-results';
import { WorkerMessageType } from './messages/worker-message.enum';

export class AppWorkers {
  constructor(public workerCtx: any) { }

  workerBroker($event: any): void {
    const message = $event.data;

    switch (message.type) {
      case WorkerMessageType.ProcessFractalInfo:
        this.startProcessor(message);
        break;
      default:
        console.error('Message not recognized');
    }
  }

  startProcessor(params: ProcessFractalInfo): void {
    const processor = new FractalProcessor(params);
    processor.process((coords) =>
      this.workerCtx.postMessage(new ProcessFractalResults(coords)));
    this.workerCtx.postMessage(new ProcessFractalDone());
  }
}
