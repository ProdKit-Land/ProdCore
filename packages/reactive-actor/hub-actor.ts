// Hub is Mediator-Observable
// Actor is Observer

// Event: Events can be used as a communication mechanism between the Hub and its Actors. 
// The Hub can trigger events to notify Actors, and Actors can add (subscribe) to these events 
// to receive updates. Events provide a decoupled and flexible way of propagating changes.

// Data: Data represents the information that is being observed. It can be a single value, 
// a collection of values, or a complex data structure. Actors can access and consume this 
// data when they receive updates.

// Callback: A fallback mechanism provides a way to handle scenarios where an Actor is not present 
// or cannot receive updates. It ensures that data changes are handled appropriately even in 
// the absence of certain Actors. This can be achieved through default values, error handling, 
// or alternative update strategies.

// The Hub (mediator-observable) is the source of data or state changes and the hub 
// for controlling communications. It maintains a list of actors and notifies them when 
// changes occur. The Hub can expose methods for actors to add (subscribe) and remove (unsubscribe).
export interface Hub {
  addActor(actor: Actor): void;
  removeActor(actor: Actor): void;
  notifyActors(event: string, data?: unknown, callback?: () => void | Promise<void>): void | Promise<void>;
}

// The Actor (observer) represents the entities that are interested in receiving updates 
// or notifications about changes in the Hub (mediator-observable). Hub can be functions, objects, 
// or components that subscribe/unsubscribe to/from the Hub.
export interface Actor {
  subscribe(hub: Hub): void;
  unsubscribe(hub: Hub): void;
  onEvent(event: string, data?: unknown, callback?: () => void | Promise<void>): void | Promise<void>;
  sendEvent(event: string, data?: unknown, callback?: () => void | Promise<void>): void | Promise<void>;
}
