// @flow
export default (ev: KeyboardEvent): boolean => {
  if (ev.button || ev.shiftKey || ev.altKey || ev.metaKey || ev.ctrlKey) return false;
  ev.stopPropagation();
  ev.preventDefault();
  return true;
};
