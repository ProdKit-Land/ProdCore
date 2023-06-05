// Everything related to event
// https://developer.mozilla.org/en-US/docs/Web/API/EventTarget
// https://developer.mozilla.org/en-US/docs/Web/API/Event
// https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent

// Common Signals: onEvent(signal: Signal, slot: () => void): void; 
// Our way: onEvent(signal: Signal, data?: Data, slot?: () => void): void;
// Our way: notifyActors(event: Singal, data?: Data, callback?: () => void | Promise<void>): void | Promise<void>;
