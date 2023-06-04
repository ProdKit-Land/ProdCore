import { Actor } from './reactive.js';
import { ReactiveHub } from './reactive-hub.js';

export abstract class ReactiveActor extends HTMLElement implements Actor {

  private hubs: ReactiveHub[] = [];

  subscribe(hub: ReactiveHub): void {
    if (!this.hubs.includes(hub)) {
      this.hubs.push(hub);
      hub.addActor(this);
    }
  }

  unsubscribe(hub: ReactiveHub): void {
    const index = this.hubs.indexOf(hub);
    if (index !== -1) {
      this.hubs.splice(index, 1);
      hub.removeActor(this);
    }
  }

  onEvent(event: string, data?: unknown, callback?: () => void): void | Promise<void> {

    console.log('Event: ', event);
    console.log('Data: ', data);
    console.log('Callback: ', callback);

    return Promise.resolve();
  }

  sendEvent(event: string, data?: unknown, callback?: (() => void | Promise<void>) | undefined): void | Promise<void> {
    for (const hub of this.hubs) {
      hub.notifyActors(event, data, callback);
    }
  }

  connectedCallback(): void {
    for (const hub of this.hubs) {
      hub.addActor(this);
    }
  }

  disconnectedCallback(): void {
    for (const hub of this.hubs) {
      hub.removeActor(this);
    }
  }

}
