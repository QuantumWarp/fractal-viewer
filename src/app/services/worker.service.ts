import { Injectable } from '@angular/core';
import { fromEvent, Observable, Subject, Subscription } from 'rxjs';

import { WorkerMessage } from '../../../worker/app-workers/messages/worker-message.interface';

@Injectable()
export class WorkerService {
  public readonly workerPath = 'assets/workers/main.js';

  workerUpdate$: Observable<WorkerMessage>;
  private worker: Worker;
  private workerSubject: Subject<WorkerMessage>;
  private workerMessageSubscription: Subscription;

  constructor() {
    this.workerInit();
  }

  doWork(workerMessage: WorkerMessage) {
    if (!this.worker) { return; }

    this.worker.postMessage(workerMessage);
  }

  workerInit(): void {
    if (this.worker) { return; }

    this.worker = new Worker(this.workerPath);
    this.workerSubject = new Subject<WorkerMessage>();
    this.workerUpdate$ = this.workerSubject.asObservable();

    this.workerMessageSubscription = fromEvent(this.worker, 'message')
      .subscribe((response: MessageEvent) => {
        if (!this.workerSubject) { return; }
        this.workerSubject.next(response.data);
      }, (error) => console.error('WORKER ERROR::', error));
  }
}
