import { LIST_SECTORES, GET_SECTOR, DELETE_SECTOR, ADD_SECTOR } from '_store/sectores/constants';

import * as sectores from '../dbOperations/sectores';

export function listSectores() {
  return sectores.listSectores();
}

export function getSector({ idSector }) {
  return sectores.getSector(idSector);
}

export function deleteSectores({ idSectores }) {
  return sectores.deleteSectores(idSectores);
}

export function addSector(sector) {
  return sectores.addSector(sector);
}

export default db =>
  sectores.init(db).then(() => ({
    [LIST_SECTORES]: listSectores,
    [GET_SECTOR]: getSector,
    [DELETE_SECTOR]: deleteSectores,
    [ADD_SECTOR]: addSector,
  }));
