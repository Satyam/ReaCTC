export default function indexBy(a, field) {
  return a.reduce((prev, item) => Object.assign(prev, { [item[field]]: item }), {});
}
