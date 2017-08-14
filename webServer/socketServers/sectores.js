import { normalize } from 'normalizr';

import sectorSchema from '_utils/sectorSchema';
import { LIST_SECTORES, GET_SECTOR, DELETE_SECTOR } from '_store/sectores/constants';

let collection;

export function init(db) {
  collection = db.collection('sectores');
  return Promise.resolve();
}

export function listSectores() {
  return collection.find({}, { idSector: 1, descrCorta: 1, descr: 1, _id: 0 }).toArray();
}

export function getSector({ idSector }) {
  return collection
    .find({ _id: idSector })
    .next()
    .then(response => normalize(response, sectorSchema));
}

export function deleteSectores({ idSectores }) {
  return collection.deleteMany({ idSector: { $in: idSectores } });
}

export default db =>
  init(db).then(() => ({
    [LIST_SECTORES]: listSectores,
    [GET_SECTOR]: getSector,
    [DELETE_SECTOR]: deleteSectores,
  }));
