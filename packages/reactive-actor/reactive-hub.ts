import { Hub, Actor } from './reactive.js';

export abstract class ReactiveHub implements Hub {

  private actors: Actor[] = [];

  constructor() {
    this.actors = [];
  }

  addActor(actor: Actor): void {
    this.actors.push(actor);
  }

  removeActor(actor: Actor): void {
    const index = this.actors.indexOf(actor);
    if (index !== -1) {
      this.actors.splice(index, 1);
    }
  }

  async notifyActors(event: string, data?: unknown, callback?: () => void): Promise<void> {
    await Promise.all(this.actors.map((actor) => actor.onEvent(event, data)));
  }

}
