import { NAME } from './constants';

export function selSenal(state, idSenal) {
  return state[NAME][idSenal];
}

export function selSenalIsManual(state, idSenal, luz) {
  return state[NAME][idSenal][luz].manual;
}

export default selSenal;
