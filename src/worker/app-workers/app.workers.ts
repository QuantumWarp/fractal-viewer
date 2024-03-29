import { FractalProcessorSquare } from './fractal-processers/fractal-processor-square';
import { ProcessFractalDone } from './messages/process-fractal-done';
import { ProcessFractalResults } from './messages/process-fractal-results';
import { ProcessFractalStart } from './messages/process-fractal-start';
import { WorkerMessageType } from './messages/worker-message.enum';

export class AppWorkers {
  constructor(public workerCtx: any) { }

  workerBroker($event: any): void {
    const message = $event.data;

    switch (message.type) {
      case WorkerMessageType.ProcessFractalStart:
        this.startProcessor(message);
        break;
      default:
        // eslint-disable-next-line no-console
        console.error('Message not recognized');
    }
  }

  startProcessor(params: ProcessFractalStart): void {
    const processor = new FractalProcessorSquare(params);
    processor.process((coords) => this.workerCtx.postMessage(new ProcessFractalResults(coords)));
    this.workerCtx.postMessage(new ProcessFractalDone());
  }
}
