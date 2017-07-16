import { tripleShape } from '_components/shapes';
import Cambio from './cambio';

export default function Triple(...args) {
  return Cambio(...args);
}

Triple.propTypes = {
  celda: tripleShape,
};
