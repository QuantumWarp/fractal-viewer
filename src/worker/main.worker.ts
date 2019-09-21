import { AppWorkers } from './app-workers/app.workers';

/// <reference lib="webworker" />

export const worker = new AppWorkers(self);
addEventListener('message', ($event: MessageEvent) => {
  worker.workerBroker($event);
});
