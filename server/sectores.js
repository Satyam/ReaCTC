let $collection;
export function init(collection) {
  $collection = collection;
  return Promise.resolve();
}

export function getSectores() {
  return $collection
    .find({}, { idSector: 1, descrCorta: 1, _id: 0 })
    .toArray()
    .then(list => ({ list }));
}

export function getSector(o) {
  return $collection.find({ _id: o.keys.idSector }).toArray().then(arr => arr[0]);
}
export default collection =>
  init(collection).then(() => ({
    '/:idSector': { read: [getSector] },
    '/': {
      read: [getSectores],
    },
  }));
