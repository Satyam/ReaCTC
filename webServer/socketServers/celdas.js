import { SET_CAMBIO, SET_CAMBIO_MANUAL } from '_store/constants';

import * as celdas from '../dbOperations/celdas';

export default async (db) => {
  await celdas.init(db);
  return {
    [SET_CAMBIO]: celdas.setCambio,
    [SET_CAMBIO_MANUAL]: celdas.setCambioManual,
  };
};
