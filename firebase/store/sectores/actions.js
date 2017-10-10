import { normalize } from 'normalizr';
import map from 'lodash/map';
import sectorSchema from '_utils/sectorSchema';

import { addStatusAdmin, clearStatusAdmin } from '_webClient/store/sectores/actions';

export { addStatusAdmin, clearStatusAdmin };

export function deleteSectores(idSectores) {
  return async (dispatch, getState, database) => {
    await Promise.all(idSectores.map(idSector => database.ref(`sectores/${idSector}`).remove()));
    await dispatch(addStatusAdmin('normal', idSectores.join(','), 'Borrados'));
  };
}

const identifier = /^\w+$/;

export function addSector(file) {
  return (dispatch, getState, database) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      let sCfg;
      try {
        sCfg = JSON.parse(e.currentTarget.result);
      } catch (err) {
        return dispatch(
          addStatusAdmin('error', file.name, `archivo no contiene JSON válido ${err}`)
        );
      }
      if (
        typeof sCfg.idSector === 'string' &&
        identifier.test(sCfg.idSector) &&
        typeof sCfg.descr === 'string' &&
        typeof sCfg.descrCorta === 'string' &&
        typeof sCfg.alto === 'number' &&
        sCfg.alto >= 1 &&
        typeof sCfg.ancho === 'number' &&
        sCfg.ancho >= 1 &&
        Array.isArray(sCfg.celdas) &&
        sCfg.celdas.length >= 1
      ) {
        const contents = normalize(sCfg, sectorSchema).entities;
        return Promise.all(
          ['celdas', 'enclavamientos', 'senales', 'sectores'].map((idSection) => {
            const section = contents[idSection];
            return (
              section &&
              map(section, (value, key) => database.ref(`${idSection}/${key}`).set(value))
            );
          })
        ).then(() => dispatch(addStatusAdmin('normal', file.name, `Agregado ${sCfg.descrCorta}`)));
      }
      return dispatch(addStatusAdmin('error', file.name, 'faltan campos obligatorios'));
    };
    reader.onerror = e => dispatch(addStatusAdmin('error', file.name, e.toString()));

    reader.readAsText(file);
  };
}
