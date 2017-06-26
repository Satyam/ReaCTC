import { CLICK_SENAL } from './constants';

export function clickSenal(idSenal) {
  return {
    type: CLICK_SENAL,
    payload: {
      idSenal,

      tipo: 'senal',
    },
  };
}
