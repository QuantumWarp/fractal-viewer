import { FractalProcessor } from './fractal-processers/fractal-processor';
import { ProcessFractalCancel } from './messages/process-fractal-cancel';
import { ProcessFractalDone } from './messages/process-fractal-done';
import { ProcessFractalResults } from './messages/process-fractal-results';
import { ProcessFractalStart } from './messages/process-fractal-start';
import { WorkerMessageType } from './messages/worker-message.enum';

export class AppWorkers {
  private processorMap = new Map<number, FractalProcessor>();

  constructor(public workerCtx: any) { }

  workerBroker($event: any): void {
    const message = $event.data;

    switch (message.type) {
      case WorkerMessageType.ProcessFractalStart:
        this.startProcessor(message);
        break;
      case WorkerMessageType.ProcessFractalCancel:
        this.cancelProcessor(message);
        break;
      default:
        console.error('Message not recognized');
    }
  }

  startProcessor(params: ProcessFractalStart): void {
    const processor = new FractalProcessor(params);
    this.processorMap.set(params.processId, processor);
    processor.process((coords) =>
      this.workerCtx.postMessage(new ProcessFractalResults(params.processId, coords)));
    this.workerCtx.postMessage(new ProcessFractalDone(params.processId, processor.cancelled));
  }

  cancelProcessor(params: ProcessFractalCancel): void {
    if (!this.processorMap.has(params.processId)) { return; }
    const processor = this.processorMap.get(params.processId);
    processor.cancelled = true;
    this.processorMap.set(params.processId, processor);
  }
}
