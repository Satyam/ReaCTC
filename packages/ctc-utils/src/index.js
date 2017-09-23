// @flow
export function indexBy(a: Array, field: string) {
  return a.reduce((prev, item) => Object.assign(prev, { [item[field]]: item }), {});
}

export function isPlainClick(ev: KeyboardEvent): boolean {
  if (ev.button || ev.shiftKey || ev.altKey || ev.metaKey || ev.ctrlKey) return false;
  ev.stopPropagation();
  ev.preventDefault();
  return true;
}

// based on: http://redux.js.org/docs/advanced/Middleware.html
/* eslint-disable no-console */
/**
 * Logs all actions and states after they are dispatched.
 */
export function reduxLogger(store: { getState: Function }) {
  return (next: Function) => (action: { type: string }) => {
    console.group(action.type);
    console.info('dispatching', action);
    const result = next(action);
    console.log('next state', store.getState());
    console.groupEnd(action.type);
    return result;
  };
}

export function splitCoords(coords: string): Array<number> {
  return coords.split(',').map(part => parseInt(part, 10));
}
