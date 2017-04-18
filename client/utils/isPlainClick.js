export default (ev) => {
  if (ev.button || ev.shiftKey || ev.altKey || ev.metaKey || ev.ctrlKey) return false;
  ev.stopPropagation();
  ev.preventDefault();
  return true;
};
