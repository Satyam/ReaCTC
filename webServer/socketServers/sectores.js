import { LIST_SECTORES, GET_SECTOR, DELETE_SECTOR, ADD_SECTOR } from '_store/sectores/constants';

import * as sectores from '../dbOperations/sectores';

export default async (db) => {
  await sectores.init(db);
  return {
    [LIST_SECTORES]: sectores.listSectores,
    [GET_SECTOR]: ({ idSector }) => sectores.getSector(idSector),
    [DELETE_SECTOR]: ({ idSectores }) => sectores.deleteSectores(idSectores),
    [ADD_SECTOR]: sectores.addSector,
  };
};
