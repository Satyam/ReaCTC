import { SET_CAMBIO, SET_CAMBIO_MANUAL } from '_store/constants';

import * as celdas from '../dbOperations/celdas';

export default db =>
  celdas.init(db).then(() => ({
    [SET_CAMBIO]: celdas.setCambio,
    [SET_CAMBIO_MANUAL]: celdas.setCambioManual,
  }));
