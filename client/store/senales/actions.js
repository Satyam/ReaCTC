import { CLICK_SENAL } from './constants';

export function clickSenal(idSector, coords, dir) {
  return {
    type: CLICK_SENAL,
    idSector,
    coords,
    dir,
  };
}
