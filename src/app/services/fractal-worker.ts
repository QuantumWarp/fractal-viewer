import { fromEvent, Observable, Subject, Subscription } from 'rxjs';
import { ProcessFractalResults } from 'worker/app-workers/messages/process-fractal-results';
import { WorkerMessageType } from 'worker/app-workers/messages/worker-message.enum';

import { ProcessFractalStart } from '../../../worker/app-workers/messages/process-fractal-start';

export class FractalWorker {
  public readonly workerPath = 'assets/workers/main.js';

  doneUpdate$: Observable<boolean>;
  resultsUpdate$: Observable<ProcessFractalResults>;

  private worker: Worker;
  private doneSubject: Subject<boolean>;
  private resultsSubject: Subject<ProcessFractalResults>;
  private workerMessageSubscription: Subscription;

  constructor() {
    this.worker = new Worker(this.workerPath);

    this.doneSubject = new Subject<boolean>();
    this.doneUpdate$ = this.doneSubject.asObservable();

    this.resultsSubject = new Subject<ProcessFractalResults>();
    this.resultsUpdate$ = this.resultsSubject.asObservable();

    this.workerMessageSubscription = fromEvent(this.worker, 'message')
      .subscribe((response: MessageEvent) => {
        if (response.data.type === WorkerMessageType.ProcessFractalDone) {
          this.stop(true);
        } else if (response.data.type === WorkerMessageType.ProcessFractalResults) {
          this.resultsSubject.next(response.data);
        }
      }, (error) => console.error('WORKER ERROR::', error));
  }

  start(processFractalStart: ProcessFractalStart) {
    this.worker.postMessage(processFractalStart);
  }

  stop(completed = false): void {
    this.doneSubject.next(completed);
    this.doneSubject.complete();

    this.resultsSubject.complete();
    this.workerMessageSubscription.unsubscribe();
    this.worker.terminate();
  }
}
