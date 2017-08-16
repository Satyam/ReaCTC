export default function indexById(a) {
  /* eslint-disable  no-underscore-dangle */
  return a.reduce((prev, item) => Object.assign(prev, { [item._id]: item }), {});
}
