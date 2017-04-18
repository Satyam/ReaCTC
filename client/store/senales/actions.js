import { CLICK_SENAL } from './constants';

export function clickSenal(idSector, coords, dir) {
  return {
    type: CLICK_SENAL,
    payload: {
      idSector,
      coords,
      dir,
      tipo: 'senal',
    },
  };
}
