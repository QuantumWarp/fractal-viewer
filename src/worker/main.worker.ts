/* eslint-disable no-restricted-globals */
import { AppWorkers } from './app-workers/app.workers';

/// <reference lib="webworker" />

export const worker = new AppWorkers(self);
self.addEventListener('message', ($event: MessageEvent) => {
  worker.workerBroker($event);
});
